import * as mongoose from 'mongoose';
import { BaseModel } from './base.model';
import { Delivery } from '../interfaces';
import schema from './schemas/delivery.schema';

export class DeliveryModel extends BaseModel {
  public model: mongoose.PaginateModel<Delivery & mongoose.Document> | any;
  constructor() {
    super(schema)
    this.model = schema
  }
  public getListWithPagination(page: any, limit: any, sort: any) {
    return this.model.paginate({}, { page: +page || 1, limit: +limit || 20, sort: this.pagination(sort) })
  }

  public parseFields(delivery: Delivery) {
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
    };
  }
}
