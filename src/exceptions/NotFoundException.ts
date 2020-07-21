import HttpException from "./HttpException";


export default class NotFoundException extends HttpException {
  constructor(name: string) {
    super(404, `${name} was not founded.`);
  }
}