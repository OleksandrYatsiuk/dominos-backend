import App from './app';
import PostsController from './posts/posts.controller';
import 'dotenv/config';
import AnyBodyController from './controllers/AnyBody.controller';
import UserManagementController from './controllers/UserManagement.controller';
import UserController from './controllers/User.controller';

const app = new App(
    [
        new UserController(),
        new AnyBodyController(),
        new UserManagementController(),
        new PostsController()
    ],
    5000, '/v1'
);
app.listen();