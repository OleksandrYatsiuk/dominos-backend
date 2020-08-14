import * as mongoose from 'mongoose';
import * as  mongoosePaginate from 'mongoose-paginate';
import { getCurrentTime } from '../../../utils/current-time-UTC';
import { Pizza } from '../../interfaces';


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
        small: { type: Number, required: true },
        middle: { type: Number, required: true },
        big: { type: Number, required: true },
    },
    category: { type: String, required: true },
    image: { type: String, default: null },
    createdAt: { type: Number, default: getCurrentTime() },
    updatedAt: { type: Number, default: getCurrentTime() }
}, { versionKey: false });
pizzaModel.plugin(mongoosePaginate);

export default mongoose.model<Pizza & mongoose.Document>('pizzas', pizzaModel);