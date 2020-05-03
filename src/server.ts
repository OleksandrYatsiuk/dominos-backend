import App from './app';
import PostsController from './posts/posts.controller';
import 'dotenv/config';
import AnyBodyController from './controllers/AnyBody.controller';

const app = new App(
    [
        new PostsController(),
        new AnyBodyController(),
    ],
    5000,
);
app.listen();