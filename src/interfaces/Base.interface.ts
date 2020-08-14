
import * as mongoose from 'mongoose';

export interface BaseModelInterface extends mongoose.Document {
    readonly _id: string;
    readonly id: string;
    readonly createdAt: number;
    readonly updatedAt: number;
}