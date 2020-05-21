import { Request, NextFunction, Response } from 'express';
import authToken from '../rest/AnyBody/authToken.model'
import { code401 } from './base.response';

export default async function checkAuth(request: Request, response: Response, next: NextFunction) {
    if (request.headers.authorization) {
        const token = request.headers.authorization.split(' ')[1]
        authToken
            .findOne({ token: token })
            .then(token => {
                if (token) {
                    if (token.expiredAt > Math.round(Date.now() / 1000)) {
                        response.locals = token.userId;
                        next()
                    } else {
                        code401(response)
                    }
                } else {
                    code401(response)
                }
            })
    } else {
        code401(response)
    }

}


