import * as mongoose from 'mongoose';

export interface Model extends mongoose.Document {
    id: any;
    createdAt: number;
    updatedAt: number;
}