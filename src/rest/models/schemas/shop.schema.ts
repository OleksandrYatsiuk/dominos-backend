import * as mongoose from 'mongoose';
import * as  mongoosePaginate from 'mongoose-paginate';
import { getCurrentTime } from '../../../utils/current-time-UTC';
import { Shop } from '../../interfaces';



const shopsSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    address: { type: String, unique: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    label: { type: String, required: true },
    draggable: { type: Boolean, required: true, default: false },
    createdAt: { type: Number, default: getCurrentTime() },
    updatedAt: { type: Number, default: getCurrentTime() },
}, { versionKey: false });

shopsSchema.plugin(mongoosePaginate);

export default mongoose.model<Shop & mongoose.Document>('shops', shopsSchema);