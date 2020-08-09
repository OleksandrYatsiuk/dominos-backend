import App from './app';
import 'dotenv/config';
import AnyBodyController from './rest/AnyBody/anyBody.controller';
import UserController from './rest/User/user.controller';
import PizzaController from './rest/Pizza/pizza.controller';
import DeliveryController from './rest/Delivery/delivery.controller';
import ShopsController from './rest/Shops/shops.controller';
import IngredientsController from './rest/Ingredients/ingredients.controller';
import UserManagementController from './rest/UserManagement/userManagement.controller';
import PromotionsController from './rest/Promotions/promotions.controller';
import ConfigController from './rest/Config/config.controller';

const app = new App(
	[
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
