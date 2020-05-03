import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

export const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return {
    field: param,
    message: `${param} ${msg}`
  };
}