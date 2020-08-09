import { Router } from "express";
import { ErrorMessage } from "../validation/ErrorMessage";
import ErrorList from "../validation/ErrorList";
import * as express from "express";

export default interface Controller {
  path: string;
  router: Router;
  list?: ErrorList;
  validator?: ErrorMessage;
  connection: any;
}
export default class Controller implements Controller {
  constructor() {
    this.list = new ErrorList();
    this.path = "/";
    this.router = express.Router();
    this.validator = new ErrorMessage();
  }
}
