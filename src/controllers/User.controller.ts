import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from '../models/user.model';
import authModel from '../models/authToken.model';
import { code200, code404, code204, code401 } from '../middleware/base.response';
import validate from '../middleware/validation.middleware';
import { update, updateLocation } from '../validations/UserManagement.validator';
import { getCurrentTime } from '../utils/current-time-UTC';
import checkAuth from '../middleware/auth.middleware';

export default class UserController implements Controller {
    public path = '/user';
    public router = express.Router();
    private user = userModel;
    private authToken = authModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.patch(`${this.path}/:id`, checkAuth, validate(update), this.update);
        this.router.put(`${this.path}/location`, checkAuth, validate(updateLocation), this.updateLocation);
        this.router.get(`${this.path}/current`, checkAuth, this.current);
        this.router.post(`${this.path}/logout`, checkAuth, this.logout);
    }

    private update = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const updatedData = Object.assign(request.body, { updatedAt: getCurrentTime() })
        this.user.findByIdAndUpdate(request.params.id, { $set: updatedData }, { new: true })
            .then(user => {
                code200(response, {
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
                })
            })
            .catch(err => code404(response, "User was not found."))
    }
    private updateLocation = (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const { lat, lng } = request.body;

        this.authToken.findOne({ token: request.headers.authorization.split(' ')[1] })
            .then(doc => {
                this.user.findByIdAndUpdate(doc.userId, { $set: { location: { lat, lng } } }, { new: true })
                    .then(user => {
                        code200(response, {
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
                        })
                    })
                    .catch(err => code404(response, "User was not found."))
            })
    }

    private current = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.authToken.findOne({ token: request.headers.authorization.split(' ')[1] })
            .then(doc => {
                this.user.findOne({ _id: doc.userId })
                    .then(user => {
                        code200(response, {
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
                        })
                    })
            })
    }

    private logout = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.authToken.findOneAndDelete({ token: request.headers.authorization.split(' ')[1] })
            .then(result => {
                result ? code204(response) : code401(response);
            })
    }
}