import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from '../models/user.model';
import authModel, { loginSchema } from '../models/authToken.model';
import { Authentication } from '../interfaces/authentication.interface';
import { Registration } from '../interfaces/registration.interface';
import { code200, code201 } from '../middleware/base.response';
import validate from '../middleware/validation.middleware';
import UnprocessableEntityException from '../exceptions/UnprocessableEntityException';
import { LoginHelper } from './actions/AnyBody/Login.action';
import { registerSchema } from '../validations/Register.validator';

export default class AnyBodyController implements Controller {
    public path = '/auth';
    public router = express.Router();
    private user = userModel;
    private userHelper = new LoginHelper();
    private authToken = authModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, validate(loginSchema), this.login);
        this.router.post(`${this.path}/register`, validate(registerSchema), this.registering);
    }

    private login = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { username, password }: Authentication = request.body;
        let hash;
        const user = await this.user.findOne({ username })
        if (user) {
            if (this.userHelper.isPasswordCorrect(password, user.passwordHash)) {
                const authToken = await this.authToken.findOne({ userId: user._id })
                if (authToken) {
                    this.userHelper.isTokenExpired(authToken.expiredAt) ? hash = this.userHelper.newToken(username, password) : hash = authToken.token;
                    this.userHelper.updateTokenTable(authToken._id, user._id, hash, response)
                } else {
                    hash = this.userHelper.newToken(username, password)
                    const token = new this.authToken({ userId: user._id, token: hash, expiredAt: Math.round(Date.now() / 1000) + 8 * 3600 })
                    token.save().then(tokenData => {
                        code200(response, {
                            token: tokenData.token,
                            expiredAt: tokenData.expiredAt,
                        })
                    })
                }
            } else {
                next(new UnprocessableEntityException(
                    { field: 'username', message: "Username or Password is invalid." }
                ));
            }
        } else {
            next(new UnprocessableEntityException(
                { field: 'username', message: "Username or Password is invalid." }
            ));
        }
    }

    private registering = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const registerData: Registration = request.body;

        const emailExist = await this.user.findOne({ email: registerData.email })
        const usernameExist = await this.user.findOne({ username: registerData.username })
        if (emailExist) {
            next(new UnprocessableEntityException({ field: 'email', message: `Email "${registerData.email}" has already been taken.` }))
        } else if (usernameExist) {
            next(new UnprocessableEntityException({ field: 'username', message: `Username "${registerData.username}" has already been taken.` }))
        } else {
            const user = new this.user(registerData);
            user.save()
                .then(user => {
                    code201(response, {
                        result: {
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
                    })
                })
        }
    }
}