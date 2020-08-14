import { Request, NextFunction, Response } from 'express';
import { AccessTokenModel } from '../rest/models/accessToken.model'
import { code401 } from './base.response';
import { getCurrentTime } from '../utils/current-time-UTC';

export function checkAuth(request: Request, response: Response, next: NextFunction) {
	const helper = new AccessTokenModel()
	if (request.headers.authorization) {
		const token = request.headers.authorization.split(' ')[1];
		helper.model.findOne({ token }).then((token) => {
			try {
				if (token.expiredAt > getCurrentTime()) {
					response.locals = token.userId;
					next();
				}
			} catch (error) {
				code401(response);
			}
		});
	} else {
		code401(response);
	}
}
