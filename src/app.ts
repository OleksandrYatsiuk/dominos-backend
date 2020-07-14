import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import { createValidator } from 'express-joi-validation';
import errorMiddleware from './middleware/error.middleware';
import { code404 } from './middleware/base.response';
import * as mysql from 'mysql';

class App {
	public app: express.Application;
	public port: number;
	public version: string;
	public validator = createValidator({ statusCode: 422, passError: true });

	public connection = mysql.createConnection({
        host: 'mongo',
        port:27017,
		user: 'root',
		database: 'dominos',
        password: 'root'
	});

	constructor(controllers, port: number, version: string) {
		this.app = express();
		this.port = port;
		this.version = version;
		this.connectToTheDatabase();
		this.setBodyParser();
		this.setCords();
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
		this.initializeErrorHandling();
		this.connectToMySQL();
	}
	/**
 * Headers (CORS)
 */
	public setCords() {
		this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
			res.header('Access-Control-Allow-Origin', '*');
			if (req.method == 'OPTIONS') {
				res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
				res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin');
				return res.status(200).json({});
			}
			next();
		});
	}

	public setBodyParser() {
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());
	}

	public listen() {
		this.app.listen(process.env.PORT, () => {
			console.log(`App running on http://${process.env.DB_HOST}:${process.env.PORT || 5000}`);
		});
	}

	private initializeMiddlewares() {
		this.app.use(bodyParser.json());
	}

	private initializeErrorHandling() {
		this.app.use(createValidator);
		this.app.use(errorMiddleware);
	}

	private initializeControllers(controllers) {
		controllers.forEach((controller) => {
			this.app.use(`/api${this.version}`, controller.router);
		});
		this.app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
			next(code404(response, 'Page not found!'));
		});
	}

	private connectToTheDatabase() {
		mongoose.connect(
			// `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-9ab1f.mongodb.net/test`,
			// {
				`mongodb://mongo:27017/local`, {
				useNewUrlParser: true,
				useCreateIndex: true,
				useUnifiedTopology: true,
				useFindAndModify: false
			}
		);
	}

	private connectToMySQL() {
		const sql = `create table if not exists users(
            id int primary key auto_increment,
            username varchar(255) not null,
            email varchar(255) not null
          )`;

		this.connection.query(sql, function(err, results) {
			if (err) console.log(err);
			else console.log('Таблица создана');
		});
	}
}

export default App;
