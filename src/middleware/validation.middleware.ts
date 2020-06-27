import { Request, Response, NextFunction } from "express";
import { code422 } from "./base.response";



export default function validate(schema, config: string = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    let body = req.body;
    config === 'body' ? body = req.body : body = req.query;
    const result = schema.validate(body, { abortEarly: false });
    if (result.error) {
      code422(res, result.error.details.map(el => {
        console.log(el)
        return {
          field: el.context.key,
          message: el.message
        }
      })
      )
    } else {
      next();
    }
  }
}  