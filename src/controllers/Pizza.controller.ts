import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import pizzaModel, { Pizza } from '../models/pizza.model';
import { code200, code200DataProvider, code204, code404, code500, code422 } from '../middleware/base.response';
import validate from '../middleware/validation.middleware';
import { pagination } from '../validations/Pagination.validator';
import NotFoundException from '../exceptions/NotFoundException';
import { getCurrentTime } from '../utils/current-time-UTC';
import checkAuth from '../middleware/auth.middleware';
import checkRoles from '../middleware/roles.middleware';
import { Roles } from '../interfaces/roles.interface';
import { pizza } from '../validations/Pizza.validator';
import { setSorting } from '../utils/sortingHelper';
import UnprocessableEntityException from '../exceptions/UnprocessableEntityException';
import AWS_S3 from '../services/AWS_S3';
import * as multer from 'multer';

const upload = multer();

export default class PizzaController implements Controller {
    public path = '/pizza';
    public router = express.Router();
    private pizza = pizzaModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, validate(pagination, 'query'), this.getList);
        this.router.post(`${this.path}`, checkAuth, checkRoles([Roles.techadmin, Roles.projectManager]), validate(pizza), this.create);
        this.router.get(`${this.path}/:id`, this.overview);
        this.router.delete(`${this.path}/:id`, checkAuth, checkRoles([Roles.techadmin]), this.remove);
        this.router.put(`${this.path}/:id`, checkAuth, checkRoles([Roles.techadmin, Roles.projectManager]), validate(pizza), this.update);
        this.router.post(`${this.path}/:id/upload`, checkAuth, checkRoles([Roles.techadmin, Roles.projectManager]), upload.single('file'), this.upload);
    }

    private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { page, limit, sort } = request.query;
        const condition = setSorting(sort);
        this.pizza.paginate({}, { page: +page || 1, limit: +limit || 20, sort: condition })
            .then(({ docs, total, limit, page, pages }) => {
                code200DataProvider(response, { total, limit, page, pages }, docs.map(pizza => {
                    return {
                        id: pizza._id,
                        name: pizza.name,
                        ingredients: pizza.ingredients,
                        weight: pizza.weight,
                        price: pizza.price,
                        category: pizza.category,
                        image: pizza.image,
                        createdAt: pizza.createdAt,
                        updatedAt: pizza.updatedAt,
                        deletedAt: pizza.deletedAt,
                        deletedBy: pizza.deletedBy
                    }
                }))
            })
    }

    private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.pizza.findByIdAndDelete(request.params.id)
            .then(result => {
                result ? code204(response) : next(new NotFoundException("Pizza"));
            })
            .catch(err => code404(response, "Pizza Id is invalid."))
    }

    private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const pizzaData: Pizza = request.body;
        this.pizza.findOne({ name: pizzaData.name })
            .then(pizza => {
                if (pizza && pizza.name == pizzaData.name) {
                    next(new UnprocessableEntityException({
                        field: "name",
                        message: `Name "${pizzaData.name}" has already been taken.`
                    }))
                } else {
                    const pizza = new this.pizza(pizzaData);
                    pizza.save()
                        .then(pizza => code200(response, pizza))
                        .catch(err => {
                            code500(response, err)
                        })
                }
            })

    }



    private update = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const updatedData = Object.assign(request.body, { updatedAt: getCurrentTime() })
        this.pizza.findByIdAndUpdate(request.params.id, { $set: updatedData }, { new: true })
            .then(pizza => code200(response, pizza))
            .catch(err => code404(response, "Pizza was not found."))
    }
    private overview = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { id } = request.params
        this.pizza.findById(id)
            .then(pizza => code200(response, {
                id: pizza._id,
                name: pizza.name,
                ingredients: pizza.ingredients,
                weight: pizza.weight,
                price: pizza.price,
                category: pizza.category,
                image: pizza.image,
                createdAt: pizza.createdAt,
                updatedAt: pizza.updatedAt,
                deletedAt: pizza.deletedAt,
                deletedBy: pizza.deletedBy
            }))
            .catch(err => code404(response, "Pizza was not found."))
    }

    private upload = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { id } = request.params;

        if (!request.file) {
            code422(response, {
                field: "file",
                message: `File can not be blank.`
            })
        }
        const { mimetype, size, originalname } = request.file;

        if (!mimetype.includes('image')) {
            code422(response, {
                field: "file",
                message: `File "${originalname}" should be image.`
            })
        }
        if (size > 10 * 1024 * 1024) {
            code422(response, {
                field: "file",
                message: `File ${originalname} should be less than 10Mib.`
            })
        }
        AWS_S3.prototype.uploadFile(request.file)
            .then(s3 => {
                this.pizza.findByIdAndUpdate(id, { $set: { image: s3["Location"] } }, { new: true })
                    .then(pizza => {
                        code200(response, {
                            id: pizza._id,
                            name: pizza.name,
                            ingredients: pizza.ingredients,
                            weight: pizza.weight,
                            price: pizza.price,
                            category: pizza.category,
                            image: pizza.image,
                            createdAt: pizza.createdAt,
                            updatedAt: pizza.updatedAt,
                            deletedAt: pizza.deletedAt,
                            deletedBy: pizza.deletedBy
                        })
                    })
                    .catch(err => code500(response, err))
            })
            .catch(err => {
                code500(response, err)
            })
    }
}