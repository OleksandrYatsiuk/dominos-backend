import HttpException from "./HttpException";

export interface Errors {
  field: string,
  message: string
}

export default class UnprocessableEntityException extends HttpException {
  constructor(error: Errors) {
    super(422, [error]);
  }
}