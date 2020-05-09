import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import pizzaModel, { Pizza } from '../models/pizza.model';
import { code200, code200DataProvider, code204, code404 } from '../middleware/base.response';
import validate from '../middleware/validation.middleware';
import { pagination } from '../validations/Pagination.validator';
import NotFoundException from '../exceptions/NotFoundException';
import { getCurrentTime } from '../utils/current-time-UTC';
import { updateRole } from '../validations/UserManagement.validator';
import checkAuth from '../middleware/auth.middleware';
import checkRoles from '../middleware/roles.middleware';
import { Roles } from '../interfaces/roles.interface';
import { pizza } from '../validations/Pizza.validator';
import { setSorting } from '../utils/sortingHelper';


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
        const pizza = new this.pizza(pizzaData);
        pizza.save()
            .then(pizza => code200(response, pizza))
            .catch(err => {
                code404(response, "Pizza was not found.")
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
}