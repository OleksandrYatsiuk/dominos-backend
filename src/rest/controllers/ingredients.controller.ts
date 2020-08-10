import * as express from 'express';
import Controller from './Controller';
import ingredientsModel from '../models/ingredients.model';
import { code200, code200DataProvider, code204, code404 } from '../../middleware/base.response';
import validate from '../../middleware/validation.middleware';
import { pagination } from '../../validation/Pagination.validator';
import NotFoundException from '../../exceptions/NotFoundException';
import checkAuth from '../../middleware/auth.middleware';
import checkRoles from '../../middleware/roles.middleware';
import { setSorting } from '../../utils/sortingHelper';
import UnprocessableEntityException from '../../exceptions/UnprocessableEntityException';
import { Ingredient } from '../interfaces/ingredients.interface';

export class IngredientsController extends Controller {
	public path = '/ingredients';
	public router = express.Router();
	private ingredient = ingredientsModel;

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, validate(pagination, 'query'), this.getList);
		this.router.delete(`${this.path}/:id`, checkAuth, checkRoles([ this.roles.techadmin ]), this.remove);
		this.router.post(`${this.path}`, checkAuth, checkRoles([this.roles.techadmin, this.roles.projectManager ]), this.create);
	}

	private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { page, limit, sort } = request.query;
		const condition = setSorting(sort);
		this.ingredient
			.paginate({}, { page: +page || 1, limit: +limit || 20, sort: condition })
			.then(({ docs, total, limit, page, pages }) => {
				code200DataProvider(
					response,
					{ total, limit, page, pages },
					docs.map((item) => {
						return {
							id: item._id,
							name: item.name
						};
					})
				);
			});
	};

	private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.ingredient
			.findByIdAndDelete(request.params.id)
			.then((result) => {
				result ? code204(response) : next(new NotFoundException('Ingredient'));
			})
			.catch((err) => code404(response, 'Ingredient Id is invalid.'));
	};
	private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const data: Ingredient = request.body;
		this.ingredient.findOne({ name: data.name }).then((res) => {
			if (!res) {
				const item = new this.ingredient(data);
				item.save().then((item) => {
					code200(response, { id: item._id, name: item.name });
				});
			} else {
				next(
					new UnprocessableEntityException(
						this.validator.addCustomError('name', this.list.UNIQUE_INVALID, [
							{ value: 'Name' },
							{ value: data.name }
						])
					)
				);
			}
		});
	};
}
