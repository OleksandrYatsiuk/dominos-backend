import * as express from 'express';
import Controller from './Controller';
import deliveryModel from '../models/delivery.model';
import { setSorting } from '../../utils/sortingHelper';
import { Delivery } from '../interfaces/delivery.interface';
import shopsModel from '../models/shops.model';
import DeliveryValidator from '../validator/delivery.validator';

export class DeliveryController extends Controller {
	public path = '/delivery';
	private delivery = deliveryModel;
	private shop = shopsModel;
	private conf = new DeliveryValidator()

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, super.checkAuth(), super.checkRoles([this.roles.techadmin, this.roles.projectManager]),
			super.validate(this.baseValidator.paginationSchema(), 'query'),
			this.getList
		);
		this.router.post(`${this.path}`, super.checkAuth(), super.validate(this.conf.delivery), this.create);
		this.router.delete(`${this.path}/:id`, super.checkAuth(), super.checkRoles([this.roles.techadmin]), this.remove);
	}

	private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { page, limit, sort } = request.query;
		const condition = setSorting(sort);
		this.delivery
			.paginate({}, { page: +page || 1, limit: +limit || 20, sort: condition })
			.then(({ docs, total, limit, page, pages }) => {
				this.send200Data(response, { total, limit, page, pages }, docs.map((delivery) => {
					return {
						id: delivery._id,
						firstName: delivery.firstName,
						phone: delivery.phone,
						email: delivery.email,
						shopId: delivery.shopId,
						pizzaIds: delivery.pizzaIds,
						address: delivery.address,
						comment: delivery.comment,
						date: delivery.date,
						payment: delivery.payment,
						image: delivery.image,
						amount: delivery.amount,
						createdAt: delivery.createdAt,
						updatedAt: delivery.updatedAt,
						deletedAt: delivery.deletedAt,
						deletedBy: delivery.deletedBy
					};
				}))
			});
	};

	private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.delivery
			.findByIdAndDelete(request.params.id)
			.then((result) => {
				result ? super.send204(response) : next(super.send404('Delivery'));
			})
			.catch((err) => super.send404('Delivery Id'));
	};

	private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const body: Delivery = request.body;
		this.shop
			.findById(body.shopId)
			.then((res) => {
				const delivery = new this.delivery(body);
				delivery.save()
					.then((delivery) => super.send201(response, delivery))
					.catch((err) => super.send500(err));
			})
			.catch((err) => {
				next(
					super.send422(
						super.custom('shopId', this.list.EXIST_INVALID, [{ value: 'Shop Id' }])
					)
				);
			});
	};
}
