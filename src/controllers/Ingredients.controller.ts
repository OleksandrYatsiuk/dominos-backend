import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import ingredientsModel, { Ingredient } from '../models/ingredients.model';
import { code200, code200DataProvider, code204, code404 } from '../middleware/base.response';
import validate from '../middleware/validation.middleware';
import { pagination } from '../validations/Pagination.validator';
import NotFoundException from '../exceptions/NotFoundException';
import checkAuth from '../middleware/auth.middleware';
import checkRoles from '../middleware/roles.middleware';
import { Roles } from '../interfaces/roles.interface';
import { delivery } from '../validations/Delivery.validator';
import { setSorting } from '../utils/sortingHelper';


export default class IngredientsController implements Controller {
    public path = '/ingredients';
    public router = express.Router();
    private ingredient = ingredientsModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, validate(pagination, 'query'), this.getList);
        this.router.delete(`${this.path}/:id`, checkAuth, checkRoles([Roles.techadmin]), this.remove);
        this.router.post(`${this.path}`, checkAuth, checkRoles([Roles.techadmin, Roles.projectManager]), this.create);

    }

    private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { page, limit, sort } = request.query;
        const condition = setSorting(sort);
        this.ingredient.paginate({}, { page: +page || 1, limit: +limit || 20, sort: condition })
            .then(({ docs, total, limit, page, pages }) => {
                code200DataProvider(response, { total, limit, page, pages }, docs.map(item => {
                    return {
                        id: item._id,
                        name: item.name
                    }
                }))
            })
    }

    private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.ingredient.findByIdAndDelete(request.params.id)
            .then(result => {
                result ? code204(response) : next(new NotFoundException("Ingredient"));
            })
            .catch(err => code404(response, "Ingredient Id is invalid."))
    }
    private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const deliveryData: Ingredient = request.body;
        const delivery = new this.ingredient(deliveryData);
        delivery.save()
            .then(pizza => code200(response, pizza))
            .catch(err => {
                code404(response, "Delivery was not found.")
            })
    }

}