import * as mongoose from 'mongoose';
import { Ingredient } from '../../interfaces/ingredients.interface';
import { BaseModel } from './base.model';
import schema from './schemas/ingredients.schema';


export class IngredientClass extends BaseModel {
	public model: mongoose.PaginateModel<Ingredient & mongoose.Document>
	constructor() {
		super(schema)
		this.model = schema

	}

	public getListWithPagination(page: any, limit: any, sort: any) {
		return this.model.paginate({}, { page: +page || 1, limit: +limit || 20, sort: this.pagination(sort) })
	}
	public remove(id: Ingredient['id']) {
		return this.model.findByIdAndDelete(id);
	}

	public create(ingredient: Ingredient) {
		return this.model.create(ingredient);
	}
	public exists(condition: object): Promise<boolean> {
		return super.isExist(condition)
	}

	public findItemsById(ids: Array<Ingredient['id']>) {
		return this.model.find({ _id: { $in: ids } })
	}

	public parseModel(model: Ingredient) {
		return {
			id: model._id,
			name: model.name,
			createdAt: model.createdAt,
			updatedAt: model.updatedAt
		}
	}
}