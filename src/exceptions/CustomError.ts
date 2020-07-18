import * as Joi from '@hapi/joi';
import ErrorList from '../validation/ErrorList';
import { ErrorMessage } from '../validation/ErrorMessage';
import HttpException from './HttpException';
import NotFoundException from './NotFoundException';
import UnprocessableEntityException from './UnprocessableEntityException';
export interface Errors {
	field: string;
	message: string;
}

export default class CustomError {
	public validator = Joi;
	public validation = new ErrorMessage();
	private list = new ErrorList();
	private joiArray = [
		{ 'any.required': this.list.REQUIRED_INVALID },
		{ 'string.empty': this.list.REQUIRED_INVALID },
		{ 'string.min': this.list.STRING_TOO_SHORT },
		{ 'string.max': this.list.STRING_TOO_LONG },
		{ 'string.base': this.list.STRING_INVALID },
		{ 'object.unknown': this.list.EXIST_INVALID },
		{ 'any.only': this.list.EXIST_INVALID },
		{ 'number.base': this.list.NUMBER_INVALID },
		{ 'number.min': this.list.NUMBER_TOO_SMALL },
		{ 'string.email': this.list.EMAIL_INVALID }
	];
	constructor() {}

	public findCode(type: string): number {
		try {
			return this.joiArray.find((item) => type in item)[type];
		} catch (error) {
			throw new HttpException(500, `"${type}" not found!`);
		}
	}
}
