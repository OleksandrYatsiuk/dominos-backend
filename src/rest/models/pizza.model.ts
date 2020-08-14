import * as mongoose from 'mongoose';
import { BaseModel } from './base.model';
import { Pizza } from '../interfaces';
import schema from './schemas/pizza.schema';

export class PizzaModel extends BaseModel {
    public model: mongoose.PaginateModel<Pizza & mongoose.Document>
    constructor() {
        super(schema)
        this.model = schema        
    }
    public getListWithPagination(page: any, limit: any, sort: any) {
		return this.model.paginate({}, { page: +page || 1, limit: +limit || 20, sort: this.pagination(sort) })
    }
    
    public parseFields(pizza: Pizza) {
		return {
			id: pizza._id,
			name: pizza.name,
			ingredients: pizza.ingredients,
			weight: pizza.weight,
			price: pizza.price,
			category: pizza.category,
			image: pizza.image,
			createdAt: pizza.createdAt,
			updatedAt: pizza.updatedAt
		};
	}
}
