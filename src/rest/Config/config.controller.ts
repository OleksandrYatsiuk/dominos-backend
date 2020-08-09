import * as express from "express";
import Controller from "../Controller";
import { code200 } from "../../middleware/base.response";
import { ValidatorsConfig } from "../../validation/ValidatorsConfig";

export default class ConfigController extends Controller {
  public path = "/config";
  public validatorConfig = new ValidatorsConfig();
  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getList);
  }

  private getList = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    code200(response, {
      errors: this.list.ERRORS,
      params: this.validatorConfig.getConfig(),
    });
  };
}
