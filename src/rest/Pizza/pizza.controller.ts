import * as express from 'express';
import Controller from '../Controller';
import pizzaModel from './pizza.model';
import { code200, code200DataProvider, code204, code404, code500, code201 } from '../../middleware/base.response';
import validate from '../../middleware/validation.middleware';
import { pagination } from '../../validation/Pagination.validator';
import NotFoundException from '../../exceptions/NotFoundException';
import { getCurrentTime } from '../../utils/current-time-UTC';
import checkAuth from '../../middleware/auth.middleware';
import checkRoles from '../../middleware/roles.middleware';
import { Roles } from '../../interfaces/roles.interface';
import { pizza } from './Pizza.validator';
import { setSorting } from '../../utils/sortingHelper';
import UnprocessableEntityException from '../../exceptions/UnprocessableEntityException';
import AWS_S3 from '../../services/AmazoneService';
import * as multer from 'multer';
import checkFiles from '../../validation/Files.validator';
import { Pizza } from './pizza.interface';
import ingredientsModel from '../../rest/Ingredients/ingredients.model';

const upload = multer();

export default class PizzaController extends Controller {
	public path = '/pizza';
	private pizza = pizzaModel;
	private ingredients = ingredientsModel;

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, validate(pagination, 'query'), this.getList);
		this.router.post(
			`${this.path}`,
			checkAuth,
			checkRoles([ Roles.techadmin, Roles.projectManager ]),
			validate(pizza),
			this.create
		);
		this.router.get(`${this.path}/:id`, this.overview);
		this.router.delete(`${this.path}/:id`, checkAuth, checkRoles([ Roles.techadmin ]), this.remove);
		this.router.put(
			`${this.path}/:id`,
			checkAuth,
			checkRoles([ Roles.techadmin, Roles.projectManager ]),
			validate(pizza),
			this.update
		);
		this.router.post(
			`${this.path}/:id/upload`,
			checkAuth,
			checkRoles([ Roles.techadmin, Roles.projectManager ]),
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
				code200DataProvider(
					response,
					{ total, limit, page, pages },
					docs.map((pizza) => this.parseFields(pizza))
				);
			});
	};

	private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.pizza
			.findByIdAndDelete(request.params.id)
			.then((result) => {
				result ? code204(response) : next(new NotFoundException('Pizza'));
			})
			.catch((err) => code404(response, 'Pizza Id is invalid.'));
	};

	private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const pizzaData: Pizza = request.body;
		this.pizza.findOne({ name: pizzaData.name }).then((pizza) => {
			if (pizza && pizza.name == pizzaData.name) {
				next(
					new UnprocessableEntityException(
						this.validator.addCustomError('name', this.list.UNIQUE_INVALID, [
							{ value: 'Name' },
							{ value: pizzaData.name }
						])
					)
				);
			} else {
				this.ingredients
					.find({ _id: { $in: pizzaData.ingredients } })
					.then((res) => {
						if (res.length != pizzaData.ingredients.length) {
							next(
								new UnprocessableEntityException(
									this.validator.addCustomError('ingredient', this.list.EXIST_INVALID, [
										{ value: 'Ingredient Id' }
									])
								)
							);
						} else {
							pizzaData.ingredients = res.map((el) => {
								return { id: el._id, name: el.name };
							});
							const pizza = new this.pizza(pizzaData);
							pizza.save().then((pizza) => code201(response, this.parseFields(pizza))).catch((err) => {
								code500(response, err);
							});
						}
					})
					.catch((err) => {
						next(
							new UnprocessableEntityException(
								this.validator.addCustomError('ingredient', this.list.EXIST_INVALID, [
									{ value: 'Ingredient Id' }
								])
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
								new UnprocessableEntityException(
									this.validator.addCustomError('ingredient', this.list.EXIST_INVALID, [
										{ value: 'Ingredient Id' }
									])
								)
							);
						} else {
							const updatedData = Object.assign(request.body, { updatedAt: getCurrentTime() });
							updatedData.ingredients = res.map((el) => {
								return { id: el._id, name: el.name };
							});
							this.pizza
								.findByIdAndUpdate(request.params.id, { $set: updatedData }, { new: true })
								.then((pizza) => code200(response, this.parseFields(pizza)))
								.catch((err) => code404(response, 'Pizza was not found.'));
						}
					})
					.catch((e) => {
						next(
							new UnprocessableEntityException(
								this.validator.addCustomError('ingredient', this.list.EXIST_INVALID, [
									{ value: 'Ingredient Id' }
								])
							)
						);
					});
			})
			.catch((err) => code404(response, 'Pizza was not found.'));
	};

	private overview = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { id } = request.params;
		this.pizza
			.findById(id)
			.then((pizza) => code200(response, this.parseFields(pizza)))
			.catch((err) => code404(response, 'Pizza was not found.'));
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
							code200(response, this.parseFields(pizza));
						} else {
							code404(response, 'Pizza not found!');
						}
					})
					.catch((err) => code500(response, err));
			})
			.catch((err) => {
				code500(response, err);
			});
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
