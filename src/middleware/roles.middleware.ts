import { Request, Response, NextFunction, request } from "express";
import { code403 } from "./base.response";
import user from '../models/user.model'


export default function checkRoles(roles: string[], ) {
    return (req: Request, res: Response, next: NextFunction) => {
        user.findById(res.locals).then(user => {
            if (!roles.includes(user.role)) {
                code403(res);
            } else {
                next();
            }
        })
    }
}  