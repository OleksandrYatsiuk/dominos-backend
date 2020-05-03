import { Errors } from "middleware/base.response";

export default class HttpException extends Error {
  code: number;
  result: string | Errors;
  constructor(code: number, result: any) {
    super(result);
    this.code = code;
    this.result = result;
  }
}

