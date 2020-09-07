import { App } from './app';
import Controller from './rest/controllers/Controller';
import {
    UserController, AnyBodyController, UserManagementController,
    PizzaController, DeliveryController, ShopsController,
    IngredientsController, PromotionsController, ConfigController
} from './rest/controllers';

let app = new App([
    new Controller(),
    new UserController(),
    new AnyBodyController(),
    new UserManagementController(),
    new PizzaController(),
    new DeliveryController(),
    new ShopsController(),
    new IngredientsController(),
    new PromotionsController(),
    new ConfigController()
], process.env.PORT, 1)
export { app };