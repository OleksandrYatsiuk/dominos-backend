import * as mongoose from 'mongoose';
import { BaseModel } from './base.model';
import schema from './schemas/room.schema';
import { Room } from '../interfaces/room';


export class RoomModel extends BaseModel {
	public model: mongoose.PaginateModel<Room & mongoose.Document>
	constructor() {
		super(schema)
		this.model = schema
	}

	public getListWithPagination(page: any, limit: any, sort: any) {
		return this.model.paginate({}, { page: +page || 1, limit: +limit || 20, sort: this.pagination(sort) })
	}

	public create(data: object) {
		return this.model.create(data);
	}
	public parseModel(room: Room) {
		return {
			id: room._id,
			sender: room.sender,
			receiver: room.receiver,
			lastMsgId: room.lastMsgId,
			createdAt: room.createdAt,
			updatedAt: room.updatedAt
		};
	}

}