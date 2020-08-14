import * as express from 'express';
import Controller from './Controller';
import { DeliveryModel } from '../models/delivery.model';
import { Delivery } from '../interfaces/delivery.interface';
import { ShopModel } from '../models/shops.model';
import DeliveryValidator from '../validator/delivery.validator';

export class DeliveryController extends Controller {
	public path = '/delivery';
	private helper = new DeliveryModel();
	private shop = new ShopModel();
	private customValidator = new DeliveryValidator()

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, super.checkAuth(), super.checkRoles([this.roles.techadmin, this.roles.projectManager]),
			super.validate(this.customValidator.paginationSchema(), 'query'), this.getList);
		this.router.post(`${this.path}`, super.checkAuth(), super.validate(this.customValidator.delivery), this.create);
		this.router.delete(`${this.path}/:id`, super.checkAuth(), super.checkRoles([this.roles.techadmin]), this.remove);
	}

	private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { page, limit, sort } = request.query;
		this.helper.getListWithPagination(page, limit, sort)
			.then(({ docs, total, limit, page, pages }) => {
				this.send200Data(response, { total, limit, page, pages }, docs.map((delivery) => this.helper.parseFields(delivery)))
			});
	};

	private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.helper.remove(request.params.id)
			.then((result) => result ? super.send204(response) : next(super.send404('Delivery')))
			.catch((err) => super.send404('Delivery Id'));
	};

	private create = ({ body }: express.Request, response: express.Response, next: express.NextFunction) => {
		const data: Delivery = body;
		this.shop.model
			.findById(data.shopId)
			.then((res) => {
				this.helper.model.create(data)
					.then((delivery) => super.send201(response, this.helper.parseFields(delivery)))
					.catch((err) => super.send500(err));
			})
			.catch(err => next(super.send422(
				super.custom('shopId', this.list.EXIST_INVALID, [{ value: 'Shop Id' }])
			)));
	};
}
