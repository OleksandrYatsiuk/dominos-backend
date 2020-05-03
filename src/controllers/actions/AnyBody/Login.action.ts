import * as bcrypt from 'bcrypt';
import * as express from 'express';
import { Authentication } from "../../../interfaces/authentication.interface";
import { getCurrentTime, setTokenLifeTime } from "../../../utils/current-time-UTC";
import { code200 } from "../../../middleware/base.response";
import UnprocessableEntityException from "../../../exceptions/UnprocessableEntityException";
import userModel from '../../../models/user.model';
import authToken from '../../../models/authToken.model';

export class LoginHelper {
    constructor() { }

    private user = userModel
    private authToken = authToken


    public findUserByUserName(username: string) {
        return this.user.findOne({ username })
    }

    public isPasswordCorrect(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }
    public newToken(username: string, password: string): string {
        const str = bcrypt.hashSync(username, 5) + bcrypt.hashSync(password, 5)
        return str.replace(/[$,./]/g, '');
    }
    public isTokenExpired(time: number): boolean {
        return time < getCurrentTime();
    }
    public updateTokenTable(tokenId, userId, token, response: express.Response) {
        this.authToken.findByIdAndUpdate(tokenId, {
            userId: userId,
            token: token,
            expiredAt: setTokenLifeTime()
        }, { new: true })
            .then(tokenData => {
                code200(response, {
                    result: {
                        token: tokenData.token,
                        expiredAt: setTokenLifeTime(),
                    }
                })
            })
    }

    private login = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        // if (this.isPasswordCorrect(password, user.passwordHash)) {
        //     const authToken = await this.authToken.findOne({ userId: user._id })
        //     this.isTokenExpired(authToken.expiredAt) ? hash = this.newToken(username, password) : hash = authToken.token;
        //     this.updateTokenTable(authToken._id, user._id, hash, response)
        // } else {
        //     next(new UnprocessableEntityException([
        //         { field: 'username', message: "Username or Password is invalid." }
        //     ]));
        // }
        // } else {
        //     next(new UnprocessableEntityException([
        //         { field: 'username', message: "Username or Password is invalid." }
        //     ]));
        // }
    }
}