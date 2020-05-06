import App from './app';
import PostsController from './posts/posts.controller';
import 'dotenv/config';
import AnyBodyController from './controllers/AnyBody.controller';
import UserManagementController from './controllers/Pizza.controller';
import UserController from './controllers/User.controller';
import PizzaController from './controllers/Pizza.controller';
import DeliveryController from './controllers/Delivery.controller';
import ShopsController from './controllers/Shops.controller';

const app = new App(
    [
        new UserController(),
        new AnyBodyController(),
        new UserManagementController(),
        new PizzaController(),
        new DeliveryController(),
        new ShopsController(),
        new PostsController()
    ],
    5000, '/v1'
);
app.listen();