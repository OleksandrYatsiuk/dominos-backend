import * as express from 'express';
import Controller from './Controller';
import { IngredientClass } from '../models/ingredients.model';
import { pagination } from '../../validation/Pagination.validator';
import { Ingredient } from '../../interfaces/ingredients.interface';

export class IngredientsController extends Controller {
	public path = '/ingredients';
	private helper = new IngredientClass()

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, super.validate(pagination, 'query'), this.getList);
		this.router.delete(`${this.path}/:id`, super.checkAuth(), super.checkRoles([this.roles.techadmin]), this.remove);
		this.router.post(`${this.path}`, super.checkAuth(), super.checkRoles([this.roles.techadmin, this.roles.projectManager]), this.create);
	}

	private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { page, limit, sort } = request.query;
		this.helper.getListWithPagination(page, limit, sort).then(({ docs, total, limit, page, pages }) => {
			super.send200Data(response, { total, limit, page, pages }, docs.map((item) => this.helper.parseModel(item)
			))
		});
	};

	private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.helper.remove(request.params.id).then((result) => {
			result ? super.send204(response) : next(super.send404('Ingredient'));
		}).catch((err) => super.send404('Ingredient'));
	};

	private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const data: Ingredient = request.body;
		this.helper.exists({ name: data.name }).then(exist => {
			if (exist) {
				next(
					super.send422(
						super.custom('name', this.list.UNIQUE_INVALID, [{ value: 'Name' }, { value: data.name }])
					)
				);
			} else {
				this.helper.create(data).then(item => super.send201(response, this.helper.parseModel(item)))
			}
		})
	}

}
