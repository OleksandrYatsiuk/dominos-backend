import * as mongoose from 'mongoose';
import { BaseModel } from './base.model';
import { Pizza, Promotion } from '../interfaces';
import schema from './schemas/promotion.schema';

export class PromotionModel extends BaseModel {
    public model: mongoose.PaginateModel<Promotion & mongoose.Document>
    constructor() {
        super(schema)
        this.model = schema
    }
    public getListWithPagination(filter: object, page: any, limit: any, sort: any) {
        return this.model.paginate(filter, { page: +page || 1, limit: +limit || 20, sort: this.pagination(sort) })
    }

    public parseFields(promotion: Promotion) {
        return {
            id: promotion._id,
            title: promotion.title,
            content: promotion.content,
            image: promotion.image,
            status: promotion.status,
            startedAt: promotion.startedAt,
            createdAt: promotion.createdAt,
            updatedAt: promotion.updatedAt
        };
    }
}
