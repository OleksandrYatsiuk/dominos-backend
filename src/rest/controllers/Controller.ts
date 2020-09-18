import { Router } from "express";
import * as multer from 'multer';
import { ErrorMessage, Params } from "../../validation/ErrorMessage";
import ErrorList from "../../validation/ErrorList";
import { BaseValidator } from '../validator/base.validator'
import * as express from "express";
import { Roles } from "../interfaces";
import { checkAuth, checkRoles, validate, code200, code201, code204, code200DataProvider, code401 } from '../../middleware/index';
import { UnprocessableEntityException, NotFoundException, HttpException, InternalServerError } from "../../exceptions/index";
import { Pagination } from "interfaces/pagination.interface";
import checkFiles from '../../validation/Files.validator';


export interface Err {
  field: string,
  code: number,
  params?: Array<Params>
}

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
  public multer = multer();
  constructor() {
    this.list = new ErrorList();
    this.path = "/";
    this.router = express.Router();
    this.validator = new ErrorMessage();
    this.baseValidator = new BaseValidator();
    this.roles = Roles;
    this.multer = multer()
  }

  public checkRoles(roles: Roles[]) {
    return checkRoles(roles);
  }
  public checkAuth() {
    return checkAuth;
  }

  public checkFiles() {
    return checkFiles();
  }

  public validate(schema, params?: string) {
    return validate(schema, params);
  }

  public send200(response: express.Response, data?) {
    return code200(response, data || null);
  }

  public send200Data(response: express.Response, pagination: Pagination, data?) {
    return code200DataProvider(response, pagination, data);
  }

  public send204(response: express.Response) {
    return code204(response);
  }

  public send201(response: express.Response, data) {
    return code201(response, data);
  }

  public send401(response: express.Response) {
    return code401(response);
  }

  public send404(errors) {
    return new NotFoundException(errors);
  }

  public send422(errors) {
    return new UnprocessableEntityException(errors);
  }

  public send500(data: any) {
    return new HttpException(InternalServerError, data)
  }

  public custom(field: string, code: number, params?: Array<Params>) {
    return [this.validator.addCustomError(field, code, params)]
  }
}
