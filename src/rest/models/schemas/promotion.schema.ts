import * as mongoose from 'mongoose';
import * as  mongoosePaginate from 'mongoose-paginate';
import { PromotionStatuses, Promotion } from '../../interfaces';
import { getCurrentTime } from '../../../utils/current-time-UTC';

const promotionSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    title: { type: String, unique: true },
    description: { type: String, required: true },
    image: { type: String, default: null },
    status: { type: Number, default: PromotionStatuses.New },
    startedAt: { type: Date, default: getCurrentTime() },
    endedAt: { type: Date, default: null },
    createdAt: { type: Number, default: getCurrentTime() },
    updatedAt: { type: Number, default: getCurrentTime() },
}, { versionKey: false });

promotionSchema.plugin(mongoosePaginate);

export default mongoose.model<Promotion & mongoose.Document>('promotion', promotionSchema);