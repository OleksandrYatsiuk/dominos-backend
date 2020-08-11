import {HttpException} from './HttpException';
import { UnprocessableEntity } from './ErrorCodesList';
import { Errors } from '../interfaces/errors.interface';

export class UnprocessableEntityException extends HttpException {
	constructor(error) {
		super(UnprocessableEntity, error);
	}
}
