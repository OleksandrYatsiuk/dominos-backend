import * as mongoose from 'mongoose';
import { getCurrentTime, setTokenLifeTime } from '../../utils/current-time-UTC';
import * as Joi from '@hapi/joi';
/**
 * converting
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/joigoose/joigoose-tests.ts
 */
export interface TokenData {
	id: string;
	userId: string|any;
	token: string;
	createdAt: number;
	expiredAt: number;
}

const authTokenSchema = new mongoose.Schema(
	{
		id: mongoose.Schema.Types.ObjectId,
		userId: { type: String, required: true },
		token: { type: String, required: true },
		createdAt: {
			type: Number,
			default: getCurrentTime()
		},
		expiredAt: { type: Number, default: setTokenLifeTime() }
	},
	{ versionKey: false }
);

export default mongoose.model<TokenData & mongoose.Document>('authToken', authTokenSchema);
