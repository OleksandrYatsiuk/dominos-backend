import * as mongoose from 'mongoose';
import { getCurrentTime, setTokenLifeTime } from '../../../utils/current-time-UTC';
import { TokenData } from '../../interfaces';




const accessTokenSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    userId: { type: String, required: true },
    token: { type: String, required: true },
    createdAt: {
        type: Number, default: getCurrentTime()
    },
    expiredAt: { type: Number, default: setTokenLifeTime() }
}, { versionKey: false });


export default mongoose.model<TokenData & mongoose.Document>('accessToken', accessTokenSchema);
