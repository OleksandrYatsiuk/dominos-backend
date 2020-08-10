import * as express from 'express';
import Controller from './Controller';
import { code200DataProvider, code201, code500 } from '../../middleware/base.response';
import validate from '../../middleware/validation.middleware';
import { pagination } from '../../validation/Pagination.validator';
import shopsModel from '../models/shops.model';
import { setSorting } from '../../utils/sortingHelper';
import { Shop } from '../interfaces/shops.interface';
import UnprocessableEntityException from '../../exceptions/UnprocessableEntityException';
import checkRoles from '../../middleware/roles.middleware';
import checkAuth from '../../middleware/auth.middleware';

export class ShopsController extends Controller {
	public path = '/shops';
	private shop = shopsModel;

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, validate(pagination, 'query'), this.data);
		this.router.post(`${this.path}/create`, checkAuth, checkRoles([this.roles.techadmin]), this.create);
	}

	private data = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { page, limit, sort } = request.query;
		const condition = setSorting(sort);
		this.shop
			.paginate({}, { page: +page || 1, limit: +limit || 20, sort: condition })
			.then(({ docs, total, limit, page, pages }) => {
				code200DataProvider(
					response,
					{ total, limit, page, pages },
					docs.map((delivery) => {
						return {
							id: delivery._id,
							address: delivery.address,
							lat: delivery.lat,
							lng: delivery.lng,
							label: delivery.label,
							createdAt: delivery.createdAt,
							updatedAt: delivery.updatedAt,
							deletedAt: delivery.deletedAt,
							deletedBy: delivery.deletedBy
						};
					})
				);
			});
	};
	private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const promoData: Shop = request.body;
		this.shop.findOne({ address: promoData.address }).then((shop) => {
			if (shop && shop.address == promoData.address) {
				next(
					new UnprocessableEntityException(
						this.validator.addCustomError('address', this.list.UNIQUE_INVALID, [
							{ value: 'Address' },
							{ value: promoData.address }
						])
					)
				);
			} else {
				const promo = new this.shop(promoData);
				promo.save().then((promotion) => code201(response, this.parseFields(promotion))).catch((err) => {
					code500(response, err);
				});
			}
		});
	};

	private parseFields(shop: Shop) {
		return {
			id: shop._id,
			address: shop.address,
			lat: shop.lat,
			lng: shop.lng,
			label: shop.label,
			draggable: shop.draggable,
			createdAt: shop.createdAt,
			updatedAt: shop.updatedAt,
			deletedAt: shop.deletedAt,
			deletedBy: shop.deletedBy
		};
	}
}
