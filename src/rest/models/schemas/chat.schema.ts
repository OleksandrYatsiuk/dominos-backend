import * as mongoose from 'mongoose';
import * as  mongoosePaginate from 'mongoose-paginate';
import { getCurrentTime } from '../../../utils/current-time-UTC';
import { Chat } from '../../interfaces/chat.interface';



const chat = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    sender: {
        id: { type: String },
        fullName: { type: String },
        image: { type: String },
    },
    message: { type: String, required: true },
    room: { type: String, required: true },
    createdAt: { type: Number, default: getCurrentTime() },
    updatedAt: { type: Number, default: getCurrentTime() },
}, { versionKey: false });

chat.plugin(mongoosePaginate);

export default mongoose.model<Chat & mongoose.Document>('chat', chat);