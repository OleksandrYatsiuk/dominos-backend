import HttpException from './HttpException';
import { UnprocessableEntity } from './ErrorCodesList';
import { Errors } from 'interfaces/errors.interface';

export default class UnprocessableEntityException extends HttpException {
	constructor(error: Errors) {
		super(UnprocessableEntity, [ error ]);
	}
}
