import * as mongoose from 'mongoose';
import * as  mongoosePaginate from 'mongoose-paginate';
import { getCurrentTime } from '../../../utils/current-time-UTC';
import { Delivery } from '../../interfaces/delivery.interface';



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
        type: { type: Number },
    },
    amount: { type: Number, required: true },
    createdAt: { type: Number, default: getCurrentTime() },
    updatedAt: { type: Number, default: getCurrentTime() },
}, { versionKey: false });

deliverySchema.plugin(mongoosePaginate);

export default mongoose.model<Delivery & mongoose.Document>('deliveries', deliverySchema);