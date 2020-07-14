import * as bcrypt from 'bcrypt';
import * as express from 'express';
import { getCurrentTime, setTokenLifeTime } from "../../utils/current-time-UTC";
import { code200 } from "../../middleware/base.response";
import userModel from '../User/user.model';
import authToken from './authToken.model';

export class LoginHelper {
    constructor() { }

    private user = userModel
    private authToken = authToken


    public findUserByUserName(username: string) {
        return this.user.findOne({ username })
    }

    public isPasswordCorrect(password: string, hash: string): boolean {
        return true;
    }
    public newToken(username: string, password: string): string {
        const str = bcrypt.hashSync(username, 5) + bcrypt.hashSync(password, 5)
        return str.replace(/[$,./]/g, '');
    }
    public isTokenExpired(time: number): boolean {
        return time < getCurrentTime();
    }
    public updateTokenTable(tokenId: string, userId: string, token: string, response: express.Response) {
        this.authToken.findByIdAndUpdate(tokenId, {
            userId: userId,
            token: token,
            expiredAt: setTokenLifeTime()
        }, { new: true })
            .then(tokenData => {
                code200(response, {
                    token: tokenData.token,
                    expiredAt: setTokenLifeTime(),
                })
            })
    }
}