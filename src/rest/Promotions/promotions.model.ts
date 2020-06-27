import * as mongoose from 'mongoose';
import { getCurrentTime } from '../../utils/current-time-UTC';
import * as  mongoosePaginate from 'mongoose-paginate';
import { Promotion } from './promotions.interface';

const promotionSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    title: { type: String, unique: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    createdAt: { type: Number, default: getCurrentTime() },
    updatedAt: { type: Number, default: getCurrentTime() },
}, { versionKey: false });

promotionSchema.plugin(mongoosePaginate);

export default mongoose.model<Promotion & mongoose.Document>('promotion', promotionSchema);