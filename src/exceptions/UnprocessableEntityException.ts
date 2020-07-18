import HttpException from './HttpException';
import * as Joi from '@hapi/joi';
export interface Errors {
	field: string;
	message: string;
}

export default class UnprocessableEntityException extends HttpException {
	constructor(error: Errors) {
		super(422, [ error ]);
	}
}
