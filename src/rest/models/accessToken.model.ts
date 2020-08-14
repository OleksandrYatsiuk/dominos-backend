import * as mongoose from 'mongoose';
import { BaseModel } from './base.model';
import schema from './schemas/accessToken.schema';
import { getCurrentTime, setTokenLifeTime } from '../../utils/current-time-UTC';
import * as crypto from 'crypto';
import { TokenData } from '../interfaces';
import { UserModel } from './user.model';


export class AccessTokenModel extends BaseModel {

    public model: mongoose.PaginateModel<TokenData & mongoose.Document>
    public user = new UserModel();

    constructor() {
        super(schema)
        this.model = schema
    }

    public create(userId: TokenData['userId']) {
        return this.model.create({
            userId,
            token: this.createAccessToken()
        });
    }

    public checkAccessTokenValid(token: string): Promise<boolean> {
        return this.model.findOne({ token }).
            then(result => {
                if (result) {
                    return result.expiredAt > getCurrentTime() ? true : false;
                } else {
                    return null;
                }
            });
    }

    private updateToken(id: TokenData['id']): object {
        return this.model.findByIdAndUpdate(id, {
            $set: {
                token: this.createAccessToken(),
                updatedAt: getCurrentTime(),
                expiredAt: setTokenLifeTime(),
            }
        }, { new: true })
    }

    private createAccessToken() {
        return crypto.randomBytes(50).toString('hex');
    }

    public confirmEmail(token: string) {
        return this.model.findOneAndDelete({ token });
    }

    public updateAccessToken(email: string): Promise<any> {
        return this.user.getUser({ email }).then(user => {
            return this.model.findOne({ userId: user._id }).then(accessTokenData => {
                if (accessTokenData !== null) {
                    return this.checkAccessTokenValid(accessTokenData.token).then(result => {
                        switch (result) {
                            case true:
                                return this.updateToken(accessTokenData._id)
                            case false:
                                return this.updateToken(accessTokenData._id)
                            default:
                                throw "Invalid Token";
                        }
                    })
                } else {
                    throw ("Invalid Token");
                }
            })
        })
    }

    public exists(condition: object): Promise<boolean> {
        return super.isExist(condition)
    }

    public parseModel(model: TokenData) {
        return {
            id: model._id,
            userId: model.userId,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            expiredAt: model.expiredAt,
        }
    }
    public findItemsById(ids: Array<TokenData['id']>) {
        return this.model.find({ _id: { $in: ids } })
    }
}