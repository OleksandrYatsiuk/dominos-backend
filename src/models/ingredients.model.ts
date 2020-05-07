import * as mongoose from 'mongoose';
import { getCurrentTime, setTokenLifeTime } from '../utils/current-time-UTC';
import * as  mongoosePaginate from 'mongoose-paginate';
export interface Ingredient {
    id: string,
    name: string,
    createdAt: number,
    updatedAt: number,
    deletedAt: number | null,
    deletedBy: string | null,
}

const ingredientsModel = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    createdAt: { type: Number, default: getCurrentTime() },
    updatedAt: { type: Number, default: getCurrentTime() },
    deletedAt: { type: Number, default: null },
    deletedBy: { type: Number, default: null }
}, { versionKey: false });
ingredientsModel.plugin(mongoosePaginate);

export default mongoose.model<Ingredient & mongoose.Document>('ingredients', ingredientsModel);