import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import { code200DataProvider } from '../middleware/base.response';
import validate from '../middleware/validation.middleware';
import { pagination } from '../validations/Pagination.validator';
import shopsModel from '../models/shops.model';
import { setSorting } from '../utils/sortingHelper';


export default class ShopsController implements Controller {
    public path = '/shops';
    public router = express.Router();
    private shop = shopsModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, validate(pagination, 'query'), this.getList);
    }

    private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { page, limit, sort } = request.query;
        const condition = setSorting(sort);
        this.shop.paginate({}, { page: +page || 1, limit: +limit || 20, sort: condition })
            .then(({ docs, total, limit, page, pages }) => {
                code200DataProvider(response, { total, limit, page, pages }, docs.map(delivery => {
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
                    }
                }))
            })
    }
}