import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { Ingredient } from '../../../interfaces/ingredients.interface';
import { getCurrentTime } from '../../../utils/current-time-UTC';


const ingredientsModel = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true, unique: true },
        createdAt: { type: Number, default: getCurrentTime() },
        updatedAt: { type: Number, default: getCurrentTime() },
    },
    { versionKey: false }
);
ingredientsModel.plugin(mongoosePaginate);

export default mongoose.model<Ingredient & mongoose.Document>('ingredients', ingredientsModel);
