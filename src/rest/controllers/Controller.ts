import { Router } from "express";
import { ErrorMessage } from "../../validation/ErrorMessage";
import ErrorList from "../../validation/ErrorList";
import { BaseValidator } from '../validator/base.validator'
import * as express from "express";
import { Roles, RolesMap } from "../interfaces";

export default interface Controller {
  path: string;
  router: Router;
  list: ErrorList;
  validator?: ErrorMessage;
  connection: any;
  baseValidator: BaseValidator;
  roles?: typeof Roles
}
export default class Controller implements Controller {
  constructor() {
    this.list = new ErrorList();
    this.path = "/";
    this.router = express.Router();
    this.validator = new ErrorMessage();
    this.baseValidator = new BaseValidator();
    this.roles = Roles;
  }
}
