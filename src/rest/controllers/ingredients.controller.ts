import * as express from 'express';
import Controller from './Controller';
import ingredientsModel from '../models/ingredients.model';
import { pagination } from '../../validation/Pagination.validator';
import { setSorting } from '../../utils/sortingHelper';
import { Ingredient } from '../../interfaces/ingredients.interface';

export class IngredientsController extends Controller {
	public path = '/ingredients';
	public router = express.Router();
	private ingredient = ingredientsModel;

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, super.validate(pagination, 'query'), this.getList);
		this.router.delete(`${this.path}/:id`, super.checkAuth, super.checkRoles([this.roles.techadmin]), this.remove);
		this.router.post(`${this.path}`, super.checkAuth, super.checkRoles([this.roles.techadmin, this.roles.projectManager]), this.create);
	}

	private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { page, limit, sort } = request.query;
		const condition = setSorting(sort);
		this.ingredient
			.paginate({}, { page: +page || 1, limit: +limit || 20, sort: condition })
			.then(({ docs, total, limit, page, pages }) => {
				super.send200Data(response, { total, limit, page, pages }, docs.map((item) => {
					return {
						id: item._id,
						name: item.name
					};
				}))
			});
	};

	private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.ingredient
			.findByIdAndDelete(request.params.id)
			.then((result) => {
				result ? super.send204(response) : next(super.send404('Ingredient'));
			})
			.catch((err) => super.send404('Ingredient'));
	};
	private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const data: Ingredient = request.body;
		this.ingredient.findOne({ name: data.name }).then((res) => {
			if (!res) {
				const item = new this.ingredient(data);
				item.save().then((item) => {
					super.send200(response, { id: item._id, name: item.name });
				});
			} else {
				next(
					super.send422(
						super.custom('name', this.list.UNIQUE_INVALID, [{ value: 'Name' }, { value: data.name }])
					)
				);
			}
		});
	};
}
