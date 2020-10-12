import * as express from 'express';
import Controller from './Controller';
import { IngredientClass } from '../models/ingredients.model';
import { pagination } from '../../validation/Pagination.validator';
import { Ingredient } from '../interfaces/ingredients.interface';
import room from "../models/schemas/room.schema";
import { RoomModel } from '../models/room.model';

export class RoomsController extends Controller {
	public path = '/rooms';
	private helper = new RoomModel()

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, super.validate(pagination, 'query'), this.getList);
		this.router.get(`${this.path}/:id`, this.geItem);
	}

	private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { page, limit, sort } = request.query;
		this.helper.getListWithPagination(page, limit, sort).then(({ docs, total, limit, page, pages }) => {
		  super.send200Data(response, { total, limit, page, pages }, docs.map((item) => this.helper.parseModel(item)
		  ))
		});

	};
	private geItem = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { page, limit, sort } = request.query;
		const id = request.params.id
		this.helper.model.findById(id)
			.then(room => super.send200(response, room))
			.catch(err => next(super.send404(err)))

	};

}
