import { HttpException } from './HttpException';
import { NotFound } from './ErrorCodesList';

export class NotFoundException extends HttpException {
	constructor(name: string) {
		super(NotFound, `${name} was not founded.`);
	}
}
