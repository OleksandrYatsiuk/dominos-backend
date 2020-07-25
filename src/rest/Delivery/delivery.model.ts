import * as mongoose from 'mongoose';
import { getCurrentTime } from '../../utils/current-time-UTC';
import * as  mongoosePaginate from 'mongoose-paginate';
import { Delivery } from './delivery.interface';



const deliverySchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    userId: { type: String },
    shopId: { type: String },
    pizzaIds: { type: Array },
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
        type: { type: Number},
    },
    amount: { type: Number, required: true },
    createdAt: { type: Number, default: Math.round(Date.now() / 1000) },
    updatedAt: { type: Number, default: Math.round(Date.now() / 1000) },
    deletedAt: { type: Number, default: null },
    deletedBy: { type: Number, default: null }
}, { versionKey: false });

deliverySchema.plugin(mongoosePaginate);

export default mongoose.model<Delivery & mongoose.Document>('deliveries', deliverySchema);