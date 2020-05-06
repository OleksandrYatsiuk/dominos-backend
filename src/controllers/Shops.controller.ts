import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import { code200, code200DataProvider, code204, code404 } from '../middleware/base.response';
import validate from '../middleware/validation.middleware';
import { pagination } from '../validations/Pagination.validator';
import NotFoundException from '../exceptions/NotFoundException';
import checkAuth from '../middleware/auth.middleware';
import checkRoles from '../middleware/roles.middleware';
import { Roles } from '../interfaces/roles.interface';
import { delivery } from '../validations/Delivery.validator';
import shopsModel from '../models/shops.model';


export default class ShopsController implements Controller {
    public path = '/shops';
    public router = express.Router();
    private shop = shopsModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, checkAuth, checkRoles([Roles.techadmin, Roles.projectManager]), validate(pagination, 'query'), this.getList);
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
        this.shop.paginate({}, { page: +page || 1, limit: +limit || 20, sort: condition })
            .then(({ docs, total, limit, page, pages }) => {
                code200DataProvider(response, { total, limit, page, pages }, docs.map(delivery => {
                    return {
                        id: delivery._id,
                        firstName: delivery.address,
                        phone: delivery.lat,
                        email: delivery.lng,
                        shop: delivery.label,
                        pizzasIds: delivery.draggable,
                        createdAt: delivery.createdAt,
                        updatedAt: delivery.updatedAt,
                        deletedAt: delivery.deletedAt,
                        deletedBy: delivery.deletedBy
                    }
                }))
            })
    }
}