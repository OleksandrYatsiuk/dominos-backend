import * as mongoose from 'mongoose';
import { BaseModel } from './base.model';
import { Shop } from '../interfaces';
import schema from './schemas/shop.schema';

export class ShopModel extends BaseModel {
    public model: mongoose.PaginateModel<Shop & mongoose.Document>
    constructor() {
        super(schema)
        this.model = schema
    }
    public getListWithPagination(page: any, limit: any, sort: any) {
        return this.model.paginate({}, { page: +page || 1, limit: +limit || 20, sort: this.pagination(sort) })
    }

    public parseFields(shop: Shop) {
        return {
            id: shop._id,
			address: shop.address,
			lat: shop.lat,
			lng: shop.lng,
			draggable: shop.draggable,
			createdAt: shop.createdAt,
			updatedAt: shop.updatedAt,
        };
    }
}
