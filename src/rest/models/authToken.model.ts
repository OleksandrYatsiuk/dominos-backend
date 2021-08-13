
import schema from './schemas/authToken.schema';
import * as mongoose from 'mongoose';

import { BaseModel } from './base.model';
import { TokenData } from '../interfaces';
export class AuthTokenModel extends BaseModel {
    public model: mongoose.PaginateModel<TokenData & mongoose.Document> | any;
    constructor() {
        super(schema)
        this.model = schema
    }

    public getItem(token: string) {
        return this.model.findOne({ token });
    }
}