import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from '../models/user.model';
import authModel from '../models/authToken.model';
import { code200, code404, code204, code401 } from '../middleware/base.response';
import validate from '../middleware/validation.middleware';
import { update, updateLocation } from '../validations/UserManagement.validator';
import { getCurrentTime } from '../utils/current-time-UTC';
import checkAuth from '../middleware/auth.middleware';
import UnprocessableEntityException from '../exceptions/UnprocessableEntityException';
import * as bcrypt from 'bcrypt';
import { changePassword } from '../validations/Register.validator';


export default class UserController implements Controller {
    public path = '/user';
    public router = express.Router();
    private user = userModel;
    private authToken = authModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.patch(`${this.path}/profile`, checkAuth, validate(update), this.update);
        this.router.put(`${this.path}/location`, checkAuth, validate(updateLocation), this.updateLocation);
        this.router.get(`${this.path}/current`, checkAuth, this.current);
        this.router.post(`${this.path}/logout`, checkAuth, this.logout);
        this.router.post(`${this.path}/change-password`, checkAuth, validate(changePassword), this.changePassword);
    }

    private update = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const updatedData = Object.assign(request.body, { updatedAt: getCurrentTime() })

        this.authToken.findOne({ token: request.headers.authorization.split(' ')[1] })
            .then(async (doc) => {
                const username = await this.user.findOne({ username: request.body.username })
                const email = await this.user.findOne({ email: request.body.email })
                if (username) {
                    if (username._id != doc.userId && username.username == request.body.username) {
                        next(new UnprocessableEntityException({ field: "username", message: `Username "${request.body.username}" has already been taken.` }));
                    }
                } else if (email) {
                    if (email._id != doc.userId && email.email == request.body.email) {
                        next(new UnprocessableEntityException({ field: "email", message: `Email "${request.body.email}" has already been taken.` }));
                    }
                } else {
                    this.user.findByIdAndUpdate(doc.userId, { $set: updatedData }, { new: true })
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
            })
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
    private changePassword = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { currentPassword, newPassword } = request.body;

        this.authToken.findOne({ token: request.headers.authorization.split(' ')[1] })
            .then(doc => {
                this.user.findById(doc.userId).then(user => {
                    if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
                        next(new UnprocessableEntityException({ field: "currentPassword", "message": "Current Password is invalid." }))
                    } else {
                        const hash = bcrypt.hashSync(newPassword, 10)
                        this.user.findByIdAndUpdate({ _id: user._id }, { $set: { passwordHash: hash } })
                            .then(result => {
                                code204(response);
                            })
                    }
                }
                )
            })
    }
}