import { Request, Response, NextFunction } from 'express';
import { code422 } from './base.response';
import CustomError from '../exceptions/CustomError';

export default function validate(schema, config: string = 'body') {
	return (req: Request, res: Response, next: NextFunction) => {
		const validator = new CustomError();
		let body = req.body;
		config === 'body' ? (body = req.body) : (body = req.query);
		const result = schema.validate(body, { abortEarly: false });
		if (result.error) {
			const errors = result.error.details.map((element) => {
				console.log(element);
				const code = validator.findCode(element.type);
				return validator.validation.addCustomError(element.path[0], code, [
					{ value: element.context.label || element.context.path[0] },
					{value:element.context?.limit}
				]);
			});
			code422(res, errors);
		} else {
			next();
		}
	};
}
