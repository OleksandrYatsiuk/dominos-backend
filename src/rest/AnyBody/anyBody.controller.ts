import * as express from 'express';
import Controller from '../../interfaces/controller.interface';
import userModel from '../User/user.model';
import { UserHelper } from '../User/user.helper';
import authModel, { loginSchema } from './authToken.model';
import accessTable from './accessToken.model';
import { Authentication } from '../../interfaces/authentication.interface';
import { Registration } from '../../interfaces/registration.interface';
import { code200, code201, code422, code204 } from '../../middleware/base.response';
import validate from '../../middleware/validation.middleware';
import UnprocessableEntityException from '../../exceptions/UnprocessableEntityException';
import { LoginHelper } from './Login.action';
import { registerSchema } from './Register.validator';
import EmailSenderService from '../../services/EmailSenderService';
import { AccessTokenHelper } from './accessToken.helper';
import NotFoundException from '../../exceptions/NotFoundException';

export default class AnyBodyController implements Controller {
    public path = '/auth';
    public router = express.Router();
    private user = userModel;
    private userHelper = new LoginHelper();
    private helper = new UserHelper();
    private accessToken = new AccessTokenHelper();
    private authToken = authModel;
    private access = accessTable;
    private mailer = new EmailSenderService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, validate(loginSchema), this.login);
        this.router.post(`${this.path}/register`, validate(registerSchema), this.registering);
        this.router.get(`${this.path}/confirm/:token`, this.confirm);
        this.router.post(`${this.path}/resend-verify-email`, this.resendVerifyEmail);
    }

    private login = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { username, password }: Authentication = request.body;
        let hash;
        const user = await this.helper.getUser({ username });
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

        const emailExist = await this.helper.getUser({ email: registerData.email })
        const usernameExist = await this.helper.getUser({ username: registerData.username })
        if (emailExist) {
            next(new UnprocessableEntityException({ field: 'email', message: `Email "${registerData.email}" has already been taken.` }))
        } else if (usernameExist) {
            next(new UnprocessableEntityException({ field: 'username', message: `Username "${registerData.username}" has already been taken.` }))
        } else {
            this.helper.createUser(registerData)
                .then(user => {
                    this.accessToken.saveAccessToken(user)
                        .then(tokenData => {
                            this.mailer.send(user.email, "Welcome to Dominos", 'register.pug', {
                                title: 'Welcome',
                                link: `https://dominos-app.herokuapp.com/${tokenData.token}`
                            })
                                .then(() => code201(response, this.helper.parseUserModel(user)));
                        })

                })
        }
    }
    private confirm = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { token } = request.params;
        this.accessToken.checkAccessTokenValid(token)
            .then(result => {
                switch (result) {
                    case null:
                        return next(new NotFoundException("Token"));
                    case false:
                        return next(new UnprocessableEntityException({ field: 'token', message: "Token is invalid." }));
                    case true:
                        return this.accessToken.confirmEmail(token)
                            .then(res => code200(response, null))
                }
            })
    }
    private resendVerifyEmail = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { email } = request.body;
        this.accessToken.updateAccessToken(email)
            .then(result => {
                this.mailer.send(email, "Welcome to Dominos", 'register.pug', {
                    title: 'Welcome',
                    link: `https://dominos-app.herokuapp.com/${result.token}`
                })
                code204(response)
            })
            .catch(errr => next(new UnprocessableEntityException({ field: "email", message: "Email is invalid." })))
    }
}