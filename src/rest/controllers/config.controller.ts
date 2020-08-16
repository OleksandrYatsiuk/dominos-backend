import * as express from 'express';
import Controller from '../controllers/Controller';
import { UserConfig, DeliveryConfig, PizzaConfig, PromotionConfig, BaseConfig } from '../validator/validatorConfig/index';
import { PromotionStatusesMap, PaymentTypeMap, RolesMap } from '../interfaces';

export class ConfigController extends Controller {
  public path = '/config';
  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.config);
  }

  private config = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.send200(response, {
      errors: this.list.ERRORS,
      params: this.getConfig(),
      lists: {
        'payment': this.convert(PaymentTypeMap),
        'roles': this.convert(RolesMap),
        'promotionStatuses': this.convert(PromotionStatusesMap)
      }
    });
  };

  private getConfig() {
    return this.merge([new BaseConfig(), new UserConfig(), new DeliveryConfig(), new PizzaConfig(), new PromotionConfig()]);
  }

private convert(statuses){
  return Object.keys(statuses).map((item) => ({ label: statuses[item], value: +item }));

}
  private merge(arrays: any) {
    let obj = {};
    arrays.forEach((config) => Object.assign(obj, config));
    return obj;
  }

}
