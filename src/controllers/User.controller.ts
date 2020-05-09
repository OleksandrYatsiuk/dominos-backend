import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from '../models/user.model';
import authModel from '../models/authToken.model';
import { code200, code404, code204, code401, code422, code500 } from '../middleware/base.response';
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
        this.router.put(`${this.path}/profile`, checkAuth, validate(update), this.update);
        this.router.put(`${this.path}/location`, checkAuth, validate(updateLocation), this.updateLocation);
        this.router.get(`${this.path}/current`, checkAuth, this.current);
        this.router.post(`${this.path}/logout`, checkAuth, this.logout);
        this.router.post(`${this.path}/change-password`, checkAuth, validate(changePassword), this.changePassword);
    }

    private update = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const updatedData = Object.assign(request.body, { updatedAt: getCurrentTime() })
        const user = await this.user.findOne({ username: updatedData.username });
        if (user && user._id != response.locals && user.username == updatedData.username) {
            next(new UnprocessableEntityException({ field: 'username', message: `Username"${updatedData.username}" has already been taken.` }))
        } else {
            const userEmail = await this.user.findOne({ email: updatedData.email })
            if (userEmail && userEmail._id != response.locals && userEmail.email == updatedData.email) {
                next(new UnprocessableEntityException({ field: 'email', message: `Email "${updatedData.email}" has already been taken.` }))
            } else {
                this.user.findByIdAndUpdate(response.locals, { $set: updatedData }, { new: true })
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
                    .catch(err => code500(response, err))
            }
        }
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
                    .catch(err => code500(response, err))
            })
    }

    private current = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.user.findOne({ _id: response.locals })
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
    }

    private logout = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.authToken.findOneAndDelete({ token: request.headers.authorization.split(' ')[1] })
            .then(result => {
                result ? code204(response) : code401(response);
            })
    }
    private changePassword = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { currentPassword, newPassword } = request.body;

        this.user.findById(response.locals).then(user => {
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
    }
}