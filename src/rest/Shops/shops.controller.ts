import * as express from 'express';
import Controller from '../Controller';
import { code200DataProvider } from '../../middleware/base.response';
import validate from '../../middleware/validation.middleware';
import { pagination } from '../../validation/Pagination.validator';
import shopsModel from './shops.model';
import { setSorting } from '../../utils/sortingHelper';


export default class ShopsController extends Controller {
    public path = '/shops';
    private shop = shopsModel;

    constructor() {
        super();
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