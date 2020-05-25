import * as express from 'express';
import Controller from '../../interfaces/controller.interface';
import { UserHelper } from '../User/user.helper';
import { code200, code200DataProvider, code204, code404 } from '../../middleware/base.response';
import validate from '../../middleware/validation.middleware';
import { pagination } from '../../validations/Pagination.validator';
import NotFoundException from '../../exceptions/NotFoundException';
import { updateRole } from './UserManagement.validator';
import checkAuth from '../../middleware/auth.middleware';
import checkRoles from '../../middleware/roles.middleware';
import { Roles } from '../../interfaces/roles.interface';
import { setSorting } from '../../utils/sortingHelper';
import UnprocessableEntityException from '../../exceptions/UnprocessableEntityException';


export default class UserManagementController implements Controller {
    
    public path = '/user-management';
    public router = express.Router();
    private helper = new UserHelper();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, checkAuth, checkRoles([Roles.techadmin, Roles.projectManager]), validate(pagination, 'query'), this.getList);
        this.router.delete(`${this.path}/:id`, checkAuth, checkRoles([Roles.techadmin]), this.remove);
        this.router.put(`${this.path}/:id/role`, checkAuth, checkRoles([Roles.techadmin]), validate(updateRole), this.updateRole);

    }

    private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { page, limit, sort } = request.query;
        const condition = setSorting(sort);
        this.helper.paginateUser(condition, +page, +limit)
            .then(({ docs, total, limit, page, pages }) => {
                code200DataProvider(response, { total, limit, page, pages }, docs.map(user => { return this.helper.parseUserModel(user) }))
            })
    }

    private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (request.params.id === response.locals) {
            next(new UnprocessableEntityException({
                field: "id",
                message: "You cannot delete himself!"
            }))
        }
        this.helper.removeUser(request.params.id)
            .then(result => {
                result ? code204(response) : next(new NotFoundException("User"));
            })
            .catch(err => code404(response, "User Id is invalid."))
    }

    private updateRole = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { role } = request.body;
        this.helper.updateUserItem(request.params.id, { role })
            .then(user => code200(response, null))
            .catch(err => code404(response, "User was not found."))
    }
}