import * as express from 'express';
import Controller from '../../interfaces/controller.interface';
import userModel from '../User/user.model';
import { code200, code200DataProvider, code204, code404 } from '../../middleware/base.response';
import validate from '../../middleware/validation.middleware';
import { pagination } from '../../validations/Pagination.validator';
import NotFoundException from '../../exceptions/NotFoundException';
import { getCurrentTime } from '../../utils/current-time-UTC';
import { updateRole } from './UserManagement.validator';
import checkAuth from '../../middleware/auth.middleware';
import checkRoles from '../../middleware/roles.middleware';
import { Roles } from '../../interfaces/roles.interface';
import { setSorting } from '../../utils/sortingHelper';
import UnprocessableEntityException from '../../exceptions/UnprocessableEntityException';


export default class UserManagementController implements Controller {
    public path = '/user-management';
    public router = express.Router();
    private user = userModel;

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
        this.user.paginate({}, { page: +page || 1, limit: +limit || 20, sort: condition })
            .then(({ docs, total, limit, page, pages }) => {
                code200DataProvider(response, { total, limit, page, pages }, docs.map(user => {
                    return {
                        id: user._id,
                        username: user.username,
                        fullName: user.fullName,
                        email: user.email,
                        role: user.role,
                        location: user.location,
                        birthday: user.birthday,
                        phone: user.phone,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                        deletedAt: user.deletedAt,
                        deletedBy: user.deletedBy
                    }
                }))
            })
    }

    private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (request.params.id === response.locals) {
            next(new UnprocessableEntityException({
                field: "id",
                message: "You cannot delete himself!"
            }))
        }
        this.user.findByIdAndDelete(request.params.id)
            .then(result => {
                result ? code204(response) : next(new NotFoundException("User"));
            })
            .catch(err => code404(response, "User Id is invalid."))
    }


    private updateRole = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { role } = request.body;

        this.user.findByIdAndUpdate(request.params.id, { $set: { role: role, updatedAt: getCurrentTime() } }, { new: true })
            .then(user => code200(response, null))
            .catch(err => code404(response, "User was not found."))
    }
}