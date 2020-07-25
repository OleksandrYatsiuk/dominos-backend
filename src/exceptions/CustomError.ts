import ErrorList from '../validation/ErrorList';
import HttpException from './HttpException';
import { ErrorMessage } from '../validation/ErrorMessage';

export default class CustomError extends ErrorMessage {
	constructor() {
		super();
	}

	private joiArray = [
		{ 'any.required': this.REQUIRED_INVALID },
		{ 'string.empty': this.REQUIRED_INVALID },
		{ 'string.min': this.STRING_TOO_SHORT },
		{ 'string.max': this.STRING_TOO_LONG },
		{ 'string.base': this.STRING_INVALID },
		{ 'object.unknown': this.EXIST_INVALID },
		{ 'any.only': this.EXIST_INVALID },
		{ 'number.base': this.NUMBER_INVALID },
		{ 'number.min': this.NUMBER_TOO_SMALL },
		{ 'string.email': this.EMAIL_INVALID }
	];

	public findCode(type: string): number {
		try {
			return this.joiArray.find((item) => type in item)[type];
		} catch (error) {
			throw new HttpException(500, `"${type}" is not define yet!`);
		}
	}
}
