import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import { code404, code422, code500 } from './base.response';

export default function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  const code = error.code || 500;
  const message = error.message || 'Internal Server Error';
  if (code == 404) {
    code404(response, message);
  } else if (code === 422) {
    code422(response, error.result);
  } else {
    code500(response, error);
  }
}