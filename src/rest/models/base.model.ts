import * as mongoose from 'mongoose';

import { getCurrentTime } from '../../utils/current-time-UTC';

export interface Model extends mongoose.Document {
    id: any;
    createdAt: number;
    updatedAt: number;
    deletedAt: number | null;
    deletedBy: number | null;
}


export class BaseModel {
    public model: Model;
    public db = mongoose;
    constructor() {

    }

    public schema(model: mongoose.SchemaDefinition) {
        return new mongoose.Schema(
            Object.assign(
                {
                    id: mongoose.Schema.Types.ObjectId
                }, model,
                {
                    createdAt: { type: Number, default: getCurrentTime() },
                    updatedAt: { type: Number, default: getCurrentTime() },
                    deletedAt: { type: Number, default: null },
                    deletedBy: { type: String, default: null },
                }
            ), { versionKey: false })
    }
}