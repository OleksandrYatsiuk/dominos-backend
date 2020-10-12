import * as mongoose from 'mongoose';
import { BaseModel } from './base.model';
import schema from './schemas/chat.schema';
import room from './schemas/room.schema';
import { Ingredient } from '../interfaces/ingredients.interface';
import { Chat } from '../interfaces/chat.interface';
import { Room } from '../interfaces/room';


export class ChatClass extends BaseModel {
	public model: mongoose.PaginateModel<Chat & mongoose.Document>
	constructor() {
		super(schema)
		this.model = schema
	}

	public create(data: object) {
		return this.model.create(data);
	}


	public parseModel(model: Chat) {
		return {
			id: model._id,
			sender: model.sender,
			createdAt: model.createdAt,
			updatedAt: model.updatedAt
		}
	}
}