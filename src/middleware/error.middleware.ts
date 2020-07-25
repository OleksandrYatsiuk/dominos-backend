import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import { code404, code422, code500, code400 } from './base.response';
import { BadRequest, InternalServerError, NotFound, Unauthorized, UnprocessableEntity } from '../exceptions/ErrorCodesList';

export default function errorMiddleware(
	error: HttpException,
	request: Request,
	response: Response,
	next: NextFunction
) {
	const code = error.code || InternalServerError;
	const message = error.message || 'Internal Server Error';
	if (error['status'] === BadRequest) {
		code400(response);
	} else {
		if (code == NotFound) {
			code404(response, message);
		} else if (code === UnprocessableEntity) {
			code422(response, error.result);
		} else {
			code500(response, error.result);
		}
	}
}
