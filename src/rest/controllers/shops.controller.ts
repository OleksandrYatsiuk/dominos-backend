import * as express from 'express';
import Controller from './Controller';
import { pagination } from '../../validation/Pagination.validator';
import { setSorting } from '../../utils/sortingHelper';
import { Shop } from '../interfaces/shops.interface';
import { ShopModel } from '../models/shops.model';

export class ShopsController extends Controller {
	public path = '/shops';
	private helper = new ShopModel();

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, super.validate(pagination, 'query'), this.data);
		this.router.post(`${this.path}/create`, super.checkAuth(), super.checkRoles([this.roles.techadmin]), this.create);
	}

	private data = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { page, limit, sort } = request.query;
		this.helper.getListWithPagination(page, limit, sort)
			.then(({ docs, total, limit, page, pages }) => super.send200Data(response, { total, limit, page, pages },
				docs.map((shops) => this.helper.parseFields(shops))))
	};
	private create = ({body}: express.Request, response: express.Response, next: express.NextFunction) => {
		const shop: Shop = body;
		this.helper.model.findOne({ address: shop.address }).then((shop) => {
			if (shop && shop.address == shop.address) {
				next(
					super.send422(
						super.custom('address', this.list.UNIQUE_INVALID, [
							{ value: 'Address' },
							{ value: shop.address }
						])
					)
				);
			} else {
				this.helper.model.create(shop)
					.then((shop) => super.send201(response, this.helper.parseFields(shop)))
					.catch((err) => next(super.send500(err)));
			}
		});
	};
}
