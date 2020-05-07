import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import deliveryModel, { Delivery } from '../models/delivery.model';
import { code200, code200DataProvider, code204, code404 } from '../middleware/base.response';
import validate from '../middleware/validation.middleware';
import { pagination } from '../validations/Pagination.validator';
import NotFoundException from '../exceptions/NotFoundException';
import checkAuth from '../middleware/auth.middleware';
import checkRoles from '../middleware/roles.middleware';
import { Roles } from '../interfaces/roles.interface';
import { delivery } from '../validations/Delivery.validator';


export default class DeliveryController implements Controller {
    public path = '/delivery';
    public router = express.Router();
    private delivery = deliveryModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, checkAuth, checkRoles([Roles.techadmin, Roles.projectManager]), validate(pagination, 'query'), this.getList);
        this.router.delete(`${this.path}/:id`, checkAuth, checkRoles([Roles.techadmin]), this.remove);
        this.router.post(`${this.path}/create`, checkAuth, validate(delivery), this.create);

    }

    private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { page, limit, sort } = request.query;
        let condition = {};
        if (sort) {
            if (sort.toString().includes('-')) {
                condition[`${sort.toString().substring(1)}`] = -1
            } else {
                condition[`${sort.toString().substring(1)}`] = 1
            }
        } else {
            condition['createdAt'] = 1
        }
        this.delivery.paginate({}, { page: +page || 1, limit: +limit || 20, sort: condition })
            .then(({ docs, total, limit, page, pages }) => {
                code200DataProvider(response, { total, limit, page, pages }, docs.map(delivery => {
                    return {
                        id: delivery._id,
                        firstName: delivery.firstName,
                        phone: delivery.phone,
                        email: delivery.email,
                        shop: delivery.shop,
                        pizzasIds: delivery.pizzasIds,
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
                    }
                }))
            })
    }

    private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.delivery.findByIdAndDelete(request.params.id)
            .then(result => {
                result ? code204(response) : next(new NotFoundException("Delivery"));
            })
            .catch(err => code404(response, "Delivery Id is invalid."))
    }
    private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const deliveryData: Delivery = request.body;
        const delivery = new this.delivery(deliveryData);
        delivery.save()
            .then(pizza => code200(response, pizza))
            .catch(err => {
                code404(response, "Delivery was not found.")
            })
    }

}