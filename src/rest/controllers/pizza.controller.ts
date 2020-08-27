import * as express from 'express';
import Controller from './Controller';
import { getCurrentTime } from '../../utils/current-time-UTC';
import AWS_S3 from '../../services/AmazoneService';
import * as multer from 'multer';
import { Pizza } from '../../rest/interfaces/pizza.interface';
import PizzaValidator from '../validator/pizza.validator';
import { IngredientClass } from '../models/ingredients.model';
import { PizzaModel } from '../models/pizza.model';

const upload = multer();

export class PizzaController extends Controller {
	public path = '/pizza';
	private helper = new PizzaModel();
	private customValidator = new PizzaValidator();
	private ingredientHelper = new IngredientClass();
	private aws = new AWS_S3();
	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, super.validate(this.customValidator.paginationSchema(), 'query'), this.getList);
		this.router.post(`${this.path}`, this.checkAuth(), super.checkRoles([this.roles.techadmin, this.roles.projectManager]),
			this.multer.any(), super.validate(this.customValidator.pizza), this.create);
		this.router.get(`${this.path}/:id`, this.overview);
		this.router.delete(`${this.path}/:id`, super.checkAuth(), super.checkRoles([this.roles.techadmin]), this.remove);
		this.router.patch(`${this.path}/:id`, super.checkAuth(), super.checkRoles([this.roles.techadmin, this.roles.projectManager]),
			this.multer.any(), super.validate(this.customValidator.pizza), this.update);
		this.router.post(`${this.path}/:id/upload`, super.checkAuth(), super.checkRoles([this.roles.techadmin, this.roles.projectManager]),
			upload.single('file'), super.checkFiles(), this.upload);
	}

	private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { page, limit, sort } = request.query;
		this.helper.getListWithPagination(page, limit, sort)
			.then(({ docs, total, limit, page, pages }) => super.send200Data(response, { total, limit, page, pages },
				docs.map(pizza => this.helper.parseFields(pizza))));
	};

	private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.helper.remove(request.params.id)
			.then((result) => result ? super.send204(response) : next(super.send404('Pizza')))
			.catch((err) => super.send404('Pizza'));
	};

	private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const data: Pizza = request.body;
		this.helper.model.exists({ name: data.name }).then(exist => {
			if (exist) {
				next(
					super.send422(
						this.custom('name', this.list.UNIQUE_INVALID, [{ value: 'Name' }, { value: data.name }])
					)
				);
			} else {
				this.ingredientHelper.findItemsById(data.ingredients)
					.then((res) => {
						if (res.length != data.ingredients.length) {
							next(
								super.send422(
									this.custom('ingredient', this.list.EXIST_INVALID, [{ value: 'Ingredient' }])
								)
							)
						} else {
							data.ingredients = res.map((el) => {
								return { id: el._id, name: el.name };
							});
							if (request.files.length > 0) {
								this.aws.uploadFile(request.files[0])
									.then(s3 => {
										data.image = s3['Location']
										this.helper.model.create(data)
											.then(promotion => super.send201(response, this.helper.parseFields(promotion)))
											.catch(err => next(super.send500(err)))
									})
									.catch(e => next(this.send500(e)))
							} else {
								data.image = null;
								this.helper.model.create(data)
									.then(pizza => super.send201(response, this.helper.parseFields(pizza)))
									.catch(err => super.send500(err));
							}
						}
					})
					.catch((err) => {
						next(
							super.send422(
								super.custom('ingredient', this.list.EXIST_INVALID, [{ value: 'Ingredient Id' }])
							)
						);
					});
			}
		});
	};

	private update = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const data: Pizza = request.body;
		this.helper.model.findById(request.params.id)
			.then((res) => {
				this.ingredientHelper.findItemsById(data.ingredients)
					.then((res) => {
						if (res.length != data.ingredients.length) {
							next(
								super.send422(
									super.custom('ingredient', this.list.EXIST_INVALID, [{ value: 'Ingredient Id' }])
								)
							);
						} else {
							const updatedData = Object.assign(request.body, { updatedAt: getCurrentTime() });
							updatedData.ingredients = res.map((el) => {
								return { id: el._id, name: el.name };
							});
							if (request.files.length > 0) {
								this.aws.uploadFile(request.files[0])
									.then(s3 => {
										updatedData.image = s3['Location']
										this.helper.model
											.findByIdAndUpdate(request.params.id, { $set: updatedData }, { new: true })
											.then((pizza) => super.send200(response, this.helper.parseFields(pizza)))
											.catch((err) => super.send404('Pizza'));
									})
									.catch(e => next(this.send500(e)))
							} else {
								typeof data.image == 'string' ? data.image = null : false;
								this.helper.model
									.findByIdAndUpdate(request.params.id, { $set: updatedData }, { new: true })
									.then((pizza) => super.send200(response, this.helper.parseFields(pizza)))
									.catch((err) => super.send404('Pizza'));
							}
						}
					})
					.catch((e) => {
						next(
							super.send422(
								super.custom('ingredient', this.list.EXIST_INVALID, [{ value: 'Ingredient Id' }])
							)
						);
					});
			})
			.catch((err) => super.send404('Pizza'));
	};

	private overview = ({ params }: express.Request, response: express.Response, next: express.NextFunction) => {
		const { id } = params;
		this.helper.model.findById(id)
			.then((pizza) => super.send200(response, this.helper.parseFields(pizza)))
			.catch((err) => super.send404('Pizza'));
	};

	private upload = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { id } = request.params;
		AWS_S3.prototype
			.uploadFile(request.file)
			.then((s3) => {
				this.helper.model
					.findByIdAndUpdate(id, { image: s3['Location'] }, { new: true })
					.then((pizza) => {
						if (pizza) {
							super.send200(response, this.helper.parseFields(pizza));
						} else {
							next(super.send404('Pizza'))
						}
					})
					.catch((err) => next(super.send500(err)))
			})
			.catch((err) => next(super.send500(err)));
	};
}
