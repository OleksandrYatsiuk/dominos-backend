import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { Ingredient } from '../../interfaces/ingredients.interface';

const ingredientsModel = new mongoose.Schema(
	{
		id: mongoose.Schema.Types.ObjectId,
		name: { type: String, required: true, unique: true }
	},
	{ versionKey: false }
);
ingredientsModel.plugin(mongoosePaginate);

export default mongoose.model<Ingredient & mongoose.Document>('ingredients', ingredientsModel);