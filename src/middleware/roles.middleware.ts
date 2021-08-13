import { Request, Response, NextFunction } from 'express';
import { code403 } from './base.response';
import user from '../rest/models/schemas/users.schema';

export function checkRoles(roles: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		user.findById(res.locals?.userId).then(({ role }) => {
			if (!roles.includes(role)) {
				code403(res);
			} else {
				next();
			}
		});
	};
}
