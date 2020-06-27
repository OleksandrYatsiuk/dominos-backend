import * as express from 'express';
import Controller from '../Controller';
import { UserHelper } from '../User/user.helper';
import { code200, code200DataProvider, code204, code404 } from '../../middleware/base.response';
import validate from '../../middleware/validation.middleware';
import { pagination } from '../../validation/Pagination.validator';
import NotFoundException from '../../exceptions/NotFoundException';
import { updateRole } from './UserManagement.validator';
import checkAuth from '../../middleware/auth.middleware';
import checkRoles from '../../middleware/roles.middleware';
import { Roles } from '../../interfaces/roles.interface';
import { setSorting } from '../../utils/sortingHelper';


export default class UserManagementController extends Controller {
    
    public path = '/user-management';
    private helper = new UserHelper();

    constructor() {
        super();
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