import * as express from 'express';
import Controller from './Controller';
import pizzaModel from '../models/pizza.model';
import { getCurrentTime } from '../../utils/current-time-UTC';
import { setSorting } from '../../utils/sortingHelper';
import AWS_S3 from '../../services/AmazoneService';
import * as multer from 'multer';
import checkFiles from '../../validation/Files.validator';
import { Pizza } from '../../rest/interfaces/pizza.interface';
import PizzaValidator from '../validator/pizza.validator';
import ingredientsModel from '../models/ingredients.model';

const upload = multer();

export class PizzaController extends Controller {
	public path = '/pizza';
	private pizza = pizzaModel;
	private ingredients = ingredientsModel
	private conf = new PizzaValidator()
	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, super.validate(this.baseValidator.paginationSchema(), 'query'), this.getList);
		this.router.post(
			`${this.path}`,
			this.checkAuth(),
			super.checkRoles([this.roles.techadmin, this.roles.projectManager]),
			super.validate(this.conf.pizza),
			this.create
		);
		this.router.get(`${this.path}/:id`, this.overview);
		this.router.delete(`${this.path}/:id`, super.checkAuth(), super.checkRoles([this.roles.techadmin]), this.remove);
		this.router.put(
			`${this.path}/:id`,
			super.checkAuth(),
			super.checkRoles([this.roles.techadmin, this.roles.projectManager]),
			super.validate(this.conf.pizza),
			this.update
		);
		this.router.post(
			`${this.path}/:id/upload`,
			super.checkAuth(),
			super.checkRoles([this.roles.techadmin, this.roles.projectManager]),
			upload.single('file'),
			checkFiles(),
			this.upload
		);
	}

	private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { page, limit, sort } = request.query;
		const condition = setSorting(sort);
		this.pizza
			.paginate({}, { page: +page || 1, limit: +limit || 20, sort: condition })
			.then(({ docs, total, limit, page, pages }) => {
				super.send200Data(response, { total, limit, page, pages }, docs.map((pizza) => this.parseFields(pizza)))
			});
	};

	private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.pizza
			.findByIdAndDelete(request.params.id)
			.then((result) => {
				result ? super.send204(response) : next(super.send404('Pizza'));
			})
			.catch((err) => super.send404('Pizza'));
	};

	private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const pizzaData: Pizza = request.body;
		this.pizza.findOne({ name: pizzaData.name }).then((pizza) => {
			if (pizza && pizza.name == pizzaData.name) {
				next(
					super.send422(
						this.custom('name', this.list.UNIQUE_INVALID, [{ value: 'Name' }, { value: pizzaData.name }])
					)
				);
			} else {
				this.ingredients
					.find({ _id: { $in: pizzaData.ingredients } })
					.then((res) => {
						if (res.length != pizzaData.ingredients.length) {
							next(
								super.send422(
									this.custom('ingredient', this.list.EXIST_INVALID, [{ value: 'Ingredient' }])
								)
							)
						} else {
							pizzaData.ingredients = res.map((el) => {
								return { id: el._id, name: el.name };
							});
							const pizza = new this.pizza(pizzaData);
							pizza.save().then((pizza) => super.send201(response, this.parseFields(pizza))).catch((err) => {
								super.send500(err);
							});
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
		const updatedData = request.body;
		this.pizza
			.findById(request.params.id)
			.then((res) => {
				this.ingredients
					.find({ _id: { $in: updatedData.ingredients } })
					.then((res) => {
						if (res.length != updatedData.ingredients.length) {
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
							this.pizza
								.findByIdAndUpdate(request.params.id, { $set: updatedData }, { new: true })
								.then((pizza) => super.send200(response, this.parseFields(pizza)))
								.catch((err) => super.send404('Pizza'));
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

	private overview = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { id } = request.params;
		this.pizza
			.findById(id)
			.then((pizza) => super.send200(response, this.parseFields(pizza)))
			.catch((err) => super.send404('Pizza'));
	};

	private upload = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { id } = request.params;
		AWS_S3.prototype
			.uploadFile(request.file)
			.then((s3) => {
				this.pizza
					.findByIdAndUpdate(id, { image: s3['Location'] }, { new: true })
					.then((pizza) => {
						if (pizza) {
							super.send200(response, this.parseFields(pizza));
						} else {
							next(super.send404('Pizza'))
						}
					})
					.catch((err) => next(super.send500(err)))
			})
			.catch((err) => next(super.send500(err)));
	};

	private parseFields(pizza: Pizza) {
		return {
			id: pizza._id,
			name: pizza.name,
			ingredients: pizza.ingredients,
			weight: pizza.weight,
			price: pizza.price,
			category: pizza.category,
			image: pizza.image,
			createdAt: pizza.createdAt,
			updatedAt: pizza.updatedAt,
			deletedAt: pizza.deletedAt,
			deletedBy: pizza.deletedBy
		};
	}
}
