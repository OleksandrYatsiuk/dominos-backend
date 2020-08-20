import { Request, Response, NextFunction } from 'express';
import { code422 } from './base.response';
import { BaseValidator } from '../rest/validator/base.validator';

export function validate(schema: any, config = 'body') {
	const validator = new BaseValidator();

	return (req: Request, res: Response, next: NextFunction) => {
		let body = req.body;
		config === 'body' ? (body = req.body) : (body = req.query);
		const result = schema.validate(body, { abortEarly: false });
		if (result.error) {
			const errors = result.error.details.map((element) => {
				const code = validator.findCode(element.type);
				return validator.addCustomError(element.path[0], code, [
					{ value: element.context.label || element.context.path[0] },
					{ value: element.context?.limit }
				]);
			});
			code422(res, errors);
		} else {
			next();
		}
	};
}
