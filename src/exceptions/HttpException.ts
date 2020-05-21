import { Errors } from "interfaces/errors.interface";

export default class HttpException extends Error {
  code: number;
  result: string | Errors;

  constructor(code: number, result: any) {
    super(result);
    this.code = code;
    this.result = result;
  }
}

