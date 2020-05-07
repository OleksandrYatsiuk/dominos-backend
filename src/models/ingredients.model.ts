import * as mongoose from 'mongoose';
import * as  mongoosePaginate from 'mongoose-paginate';
export interface Ingredient {
    id: string,
    name: string
}

const ingredientsModel = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true }
}, { versionKey: false });
ingredientsModel.plugin(mongoosePaginate);

export default mongoose.model<Ingredient & mongoose.Document>('ingredients', ingredientsModel);