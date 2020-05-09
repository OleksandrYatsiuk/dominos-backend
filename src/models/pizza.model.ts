import * as mongoose from 'mongoose';
import * as  mongoosePaginate from 'mongoose-paginate';
export interface Pizza {
    id: string,
    name: string,
    ingredients: string[],
    weight: {
        low: number,
        medium: number,
        high: number
    },
    price: {
        low: number,
        medium: number,
        high: number
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
        low: { type: Number, required: true },
        medium: { type: Number, required: true },
        high: { type: Number, required: true },
    },
    price: {
        low: { type: Number, required: true },
        medium: { type: Number, required: true },
        high: { type: Number, required: true },
    },
    category: { type: String, required: true },
    image: { type: String, default: null },
    createdAt: { type: Number, default: Math.round(Date.now() / 1000) },
    updatedAt: { type: Number, default: Math.round(Date.now() / 1000) },
    deletedAt: { type: Number, default: null },
    deletedBy: { type: Number, default: null }
}, { versionKey: false });
pizzaModel.plugin(mongoosePaginate);

export default mongoose.model<Pizza & mongoose.Document>('pizzas', pizzaModel);