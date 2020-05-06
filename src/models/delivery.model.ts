import * as mongoose from 'mongoose';
import { getCurrentTime, setTokenLifeTime } from '../utils/current-time-UTC';
import * as Joi from '@hapi/joi';
import * as  mongoosePaginate from 'mongoose-paginate';
export interface Delivery {
    id: string,
    firstName: string,
    phone: number,
    email: string,
    pizzasIds: string[],
    shop: string,
    address?: {
        street: string,
        house: number,
        entrance?: string,
        code?: number,
        floor?: number,
    },
    comment: string,
    date: {
        date: string,
        time: string
    },
    payment: {
        coupon?: string,
        remainder?: string
        type: string
    },
    image: string | null,
    amount: number,
    createdAt: number,
    updatedAt: number,
    deletedAt: number | null,
    deletedBy: string | null,
}

const deliverySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    userId: { type: String },
    shop: { type: String },
    pizzasIds: { type: Array },
    address: {
        street: { type: String },
        house: { type: Number },
        flat: { type: Number },
        entrance: { type: String },
        code: { type: Number },
        floor: { type: Number },
    },
    comment: { type: String },
    date: {
        date: { type: String },
        time: { type: String },
    },
    payment: {
        coupon: { type: String },
        remainder: { type: String },
        type: { type: String, enum: ["cash", "card"] },
    },
    amount: { type: Number, required: true },
    createdAt: { type: Number, default: getCurrentTime() },
    updatedAt: { type: Number, default: getCurrentTime() },
    deletedAt: { type: Number, default: null },
    deletedBy: { type: Number, default: null }
}, { versionKey: false });

deliverySchema.plugin(mongoosePaginate);

export default mongoose.model<Delivery & mongoose.Document>('deliveries', deliverySchema);