import { Request, NextFunction, Response } from 'express';
import authToken from '../rest/AnyBody/authToken.model';
import { code401 } from './base.response';
import { getCurrentTime } from '../utils/current-time-UTC';

export function checkAuth(request: Request, response: Response, next: NextFunction) {
	if (request.headers.authorization) {
		const token = request.headers.authorization.split(' ')[1];
		authToken.findOne({ token: token }).then((token) => {
			try {
				if (token.expiredAt > getCurrentTime()) {
					console.log(token);

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
