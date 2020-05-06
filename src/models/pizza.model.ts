import * as mongoose from 'mongoose';
import { getCurrentTime, setTokenLifeTime } from '../utils/current-time-UTC';
import * as Joi from '@hapi/joi';
import * as  mongoosePaginate from 'mongoose-paginate';
export interface Pizza {
    id: string,
    name: string,
    ingredients: string[],
    weight: {
        small: number,
        middle: number,
        big: number,
    },
    price: {
        low: number,
        medium: number,
        high: number,
    },
    category: string,
    image: string | null,
    createdAt: number,
    updatedAt: number,
    deletedAt: number | null,
    deletedBy: string | null,
}

const pizzaModel = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    ingredients: { type: Array, required: true },
    weight: {
        small: { type: Number, required: true },
        middle: { type: Number, required: true },
        big: { type: Number, required: true },
    },
    price: {
        low: { type: Number, required: true },
        medium: { type: Number, required: true },
        high: { type: Number, required: true },
    },
    category: { type: String, required: true },
    image: { type: String, default: null },
    createdAt: { type: Number, default: getCurrentTime() },
    updatedAt: { type: Number, default: getCurrentTime() },
    deletedAt: { type: Number, default: null },
    deletedBy: { type: Number, default: null }
}, { versionKey: false });
pizzaModel.plugin(mongoosePaginate);

export default mongoose.model<Pizza & mongoose.Document>('pizzas', pizzaModel);