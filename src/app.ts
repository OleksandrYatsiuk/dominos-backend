import * as express from 'express';
import * as http from "http";
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as socketIo from 'socket.io';
import { ChatSocket } from "./rest/controllers/chat.controller";
import errorMiddleware from './middleware/error.middleware';
import Controller from './rest/controllers/Controller';
import { code404 } from './middleware';
const swaggerDocument = require('./swagger/swagger.json');
import * as swaggerUi from 'swagger-ui-express';

export class App {
    public static readonly PORT: number = 5000;
    public static readonly VERSION: number = 1;
    private version: string | number;
    private app: express.Application;
    private server: http.Server;
    private io: SocketIO.Server;
    private port: string | number;
    public host: string;
    private hostDb: string;

    constructor(controllers: Controller[], port?: string | number, version?: string | number) {
        this.port = +port | App.PORT;
        this.version = `/v` + version;
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
        this.connectToTheDatabase();
    }

    private createApp(): void {
        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private createServer(): void {
        this.server = http.createServer(this.app);
    }

    private config(): void {
        this.configureUrl();
    }

    private sockets(): void {
        this.io = socketIo.listen(this.server, { origins: '*:*' });
    }

    public listen(): void {
        new ChatSocket(this.io)
        this.server.listen(this.port, () => {
            console.log("Running server on port " + this.host);
        });
    }

    private configureUrl() {
        switch (process.env.PROD) {
            case 'false':
                this.host = `http://${process.env.API_URL}:${this.port}/`
                this.hostDb = `mongodb://mongo:${process.env.DB_PORT}/${process.env.DB_NAME}`;
                break;
            default:
                this.host = `${process.env.HEROKU_URL}`;
                this.hostDb = `mongodb+srv://${process.env.MONGO_USER}:${process.env
                    .MONGO_PASSWORD}@cluster0-9ab1f.mongodb.net/${process.env.DB_NAME}`;
                break;
        }
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(`/api${this.version}`, controller.router)

        })
        this.setSwagger();
        this.app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
            next(code404(response, 'Page not found!'));
        });

    }

    private setSwagger() {
        this.app.use(express.static('src/swagger'));
        this.app.use('/rest', (req: express.Request, res: express.Response) => res.send(swaggerDocument));
        var options = {
            swaggerOptions: {
                urls: [{
                    url: `${this.host}rest`,
                    name: 'Local'
                }]
            }
        };
        this.app.use('/', (req, res, next) => {
            swaggerDocument.host = req.get('host');
            req['swaggerDoc'] = swaggerDocument;
            next();
        },
            swaggerUi.serve,
            swaggerUi.setup(null, options)
        );

    }

    private connectToTheDatabase() {

        mongoose
            .connect(this.hostDb, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            })
            .then(() => console.info('MongoDB connected successfully!'))
            .catch((error) => console.error(`MongoDB error:\n ${error}`));
    }

}
