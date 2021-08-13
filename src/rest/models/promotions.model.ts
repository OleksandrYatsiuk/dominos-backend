import * as mongoose from 'mongoose';
import { BaseModel } from './base.model';
import { Promotion } from '../interfaces';
import schema from './schemas/promotion.schema';

export class PromotionModel extends BaseModel {
    public model: mongoose.PaginateModel<Promotion & mongoose.Document> | any;
    constructor() {
        super(schema)
        this.model = schema
    }
    public getListWithPagination(filter: object, page: any, limit: any, sort: any) {
        return this.model.paginate(filter, { page: +page || 1, limit: +limit || 20, sort: this.pagination(sort) })
    }
}
