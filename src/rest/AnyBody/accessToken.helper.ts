
import accessToken from './accessToken.model';
import { getCurrentTime } from '../../utils/current-time-UTC';
import * as bcrypt from 'bcrypt';
import User from '../../rest/User/user.interface';
import { UserHelper } from '../../rest/User/user.helper';

export class AccessTokenHelper {
    private access = accessToken;
    private user = new UserHelper();


    constructor() { }

    public getItem(token: string) {
        return this.access.findOne({ token })
            .then(result => {
                if (result) {
                    return result
                } else {
                    throw "Not Found.";
                }
            })
    }
    public findToken(userId: string) {
        return this.access.findOne({ userId });
    }

    public checkAccessTokenValid(token: string): Promise<boolean> {
        return this.access.findOne({ token }).
            then(result => {
                if (result) {
                    return result.expiredAt > getCurrentTime() ? true : false;
                } else {
                    return null;
                }
            });
    }

    private updateToken(id: string, token: string) {
        return this.access.findByIdAndUpdate(id, {
            $set: {
                token,
                createdAt: getCurrentTime(),
                expiredAt: (getCurrentTime() + 2 * 3600),
            }
        }, { new: true })
    }

    private createAccessToken(email: string) {
        return bcrypt.hashSync(email, 5) + bcrypt.hashSync(Date.toString(), 5)
    }

    public confirmEmail(token: string) {
        return this.access.findOneAndDelete({ token });
    }

    public saveAccessToken(user: User) {
        const token = new this.access({
            userId: user._id,
            token: this.createAccessToken(user.email),
            createdAt: getCurrentTime(),
            expiredAt: (getCurrentTime() + 2 * 3600),
        })
        return token.save()
    }

    public updateAccessToken(email: string): Promise<any> {
        return this.user.getUserId({ email }).then(user => {
            return this.findToken(user._id).then(accessTokenData => {
                if (accessTokenData !== null) {
                    return this.checkAccessTokenValid(accessTokenData.token).then(result => {
                        switch (result) {
                            case true:
                                return this.updateToken(accessTokenData._id, this.createAccessToken(email))
                            case false:
                                return this.updateToken(accessTokenData._id, this.createAccessToken(email))
                            default:
                                throw ("Invalid Token");
                        }
                    })
                } else {
                    throw ("Invalid Token");
                }
            })
        })

    }
}