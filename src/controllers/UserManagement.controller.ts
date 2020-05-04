import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from '../models/user.model';
import { code200, code200DataProvider, code204, code404 } from '../middleware/base.response';
import validate from '../middleware/validation.middleware';
import { pagination } from '../validations/Pagination.validator';
import NotFoundException from '../exceptions/NotFoundException';
import { getCurrentTime } from '../utils/current-time-UTC';
import { updateRole } from '../validations/UserManagement.validator';

export interface Pagination {
    total: number
    limit: number,
    page: number,
    pages: number,
}

export interface UserList extends Pagination {
    sort: number
}

export default class UserManagementController implements Controller {
    public path = '/user-management';
    public router = express.Router();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, validate(pagination, 'query'), this.getList);
        this.router.delete(`${this.path}/:id`, this.remove);
        this.router.put(`${this.path}/:id/role`, validate(updateRole), this.updateRole);

    }

    private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { page, limit, sort } = request.query;
        let condition = {};
        if (sort) {
            if (sort.toString().includes('-')) {
                condition[`${sort.toString().substring(1)}`] = -1
            } else {
                condition[`${sort.toString().substring(1)}`] = 1
            }
        } else {
            condition['createdAt'] = 1
        }
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