import App from './app';
import 'dotenv/config';
import {
	AnyBodyController,
	UserController,
	UserManagementController,
	PizzaController,
	DeliveryController,
	ShopsController,
	IngredientsController,
	PromotionsController,
	ConfigController
} from './rest/controllers/index';
import Controller from './rest/controllers/Controller';

const app = new App(
	[
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
	],
	+process.env.PORT,
	'/v1'
);
app.listen();
