import * as mongoose from 'mongoose';
import { getCurrentTime, setTokenLifeTime } from '../utils/current-time-UTC';
import * as  mongoosePaginate from 'mongoose-paginate';

export interface Shop {
    id: string,
    address: string,
    lat: number,
    lng: string,
    label: string[],
    draggable: string,
    createdAt: number,
    updatedAt: number,
    deletedAt: number | null,
    deletedBy: string | null,
}

const shopsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    address: { type: String, unique: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    label: { type: String, required: true },
    draggable: { type: Boolean, required: true, default: false },
    createdAt: { type: Number, default: getCurrentTime() },
    updatedAt: { type: Number, default: getCurrentTime() },
    deletedAt: { type: Number, default: null },
    deletedBy: { type: Number, default: null }
}, { versionKey: false });

shopsSchema.plugin(mongoosePaginate);

export default mongoose.model<Shop & mongoose.Document>('shops', shopsSchema);