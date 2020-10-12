import * as mongoose from 'mongoose';
import * as  mongoosePaginate from 'mongoose-paginate';
import { getCurrentTime } from '../../../utils/current-time-UTC';
import { Chat } from '../../interfaces/chat.interface';
import { Room } from '../../interfaces/room';
import { allow } from '@hapi/joi';



const room = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    sender:
    {
        id: { type: String },
        fullName: { type: String, allow: null },
        image: { type: String, allow: null }

    },
    receiver:
    {
        id: { type: String },
        fullName: { type: String, allow: null },
        image: { type: String, allow: null }
    },
    lastMsgId: { type: String, ref: 'chat', default: null },
    createdAt: { type: Number, default: getCurrentTime() },
    updatedAt: { type: Number, default: getCurrentTime() },
}, { versionKey: false });

room.plugin(mongoosePaginate);

export default mongoose.model<Room & mongoose.Document>('room', room);