import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../exceptions/HttpException';
import { check, validationResult } from 'express-validator';

export default function validationMiddleware<T>(type: any): express.RequestHandler {
  return (req, res, next) => {
    console.log('ddd')
    const errors = validationResult(req);
    console.log(errors);
    if (Object.keys(errors).length !== 0) {
      next(new HttpException(422, 'some error'));

    } else {
      next(new HttpException(404, 'opps'));
    }
  }
}