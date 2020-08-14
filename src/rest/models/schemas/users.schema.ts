import * as mongoose from 'mongoose';
import * as  mongoosePaginate from 'mongoose-paginate';
import { RolesMap, Roles, User } from '../../interfaces/index';

const userSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    fullName: { type: String },
    username: { type: String },
    email: { type: String },
    passwordHash: { type: String },
    role: { type: String, default: RolesMap[Roles.public] },
    birthday: { type: String, default: null },
    phone: { type: String, default: null },
    location: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
    },
    image: { type: String, default: null },
    createdAt: { type: Number, default: Date.now() },
    updatedAt: { type: Number, default: Date.now() },
    deletedAt: {
        type: Number, default: null
    },
    deletedBy: {
        type: Number, default: null
    }
}, { versionKey: false });

userSchema.plugin(mongoosePaginate);

export default mongoose.model<User & mongoose.Document>('users', userSchema);