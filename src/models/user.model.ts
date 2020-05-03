import * as mongoose from 'mongoose';
import User from '../interfaces/user.interface';
import * as Joi from '@hapi/joi';

const userSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    fullName: { type: String },
    username: { type: String },
    email: { type: String },
    passwordHash: { type: String },
    role: { type: String, default: "public" },
    birthday: { type: String, default: null },
    phone: { type: Number, default: null },
    location: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
    },
    createdAt: {
        type: Number, default: Math.round(Date.now() / 1000)
    },
    updatedAt: {
        type: Number, default: Math.round(Date.now() / 1000)
    },
    deletedAt: {
        type: Number, default: null
    },
    deletedBy: {
        type: Number, default: null
    }
}, { versionKey: false });

export default mongoose.model<User & mongoose.Document>('users', userSchema);