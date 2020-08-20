import * as mongoose from 'mongoose';

export interface Model extends mongoose.Document {
    readonly _id: string;
    readonly id: string;
    readonly createdAt: number;
    updatedAt: number;
}