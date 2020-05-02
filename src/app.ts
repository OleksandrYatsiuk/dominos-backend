import * as express from 'express';
import * as bodyParser from 'body-parser';
import errorMiddleware from './middleware/error.middleware';
import * as mongoose from 'mongoose';

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers, port) {
        this.app = express();
        this.port = port;
        this.setBodyParser();
        this.setCords();
        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    /**
 * Headers (CORS)
 */
    public setCords() {
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            if (req.method == "OPTIONS") {
                res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
                res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
                return res.status(200).json({});
            }
            next();
        })
    }

    public setBodyParser() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
    }

    public expressValidator(){
        
    }

    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private connectToTheDatabase() {
        mongoose.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-9ab1f.mongodb.net/test?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
    }
}

export default App;