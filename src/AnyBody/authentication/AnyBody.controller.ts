import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as express from 'express';
import Controller from '../../interfaces/controller.interface';
import validationMiddleware from '../../middleware/validation.middleware';
import userModel from '../../users/user.model';
import authModel from './authentication.model';
import { Authentication } from '../interfaces/authentication.interface';
import HttpException from '../../exceptions/HttpException';
import { setTokenLifeTime, getCurrentTime } from '../../utils/current-time-UTC';
import { Registration } from '../interfaces/registration.interface';

export default class AnyBodyController implements Controller {
    public path = '/auth';
    public router = express.Router();
    private user = userModel;
    private authToken = authModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, this.loggingIn);
        this.router.post(`${this.path}/register`, this.registering);

    }

    private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInData: Authentication = request.body;
        const user = await this.user.findOne({ username: logInData.username });
        if (user) {
            const str = bcrypt.hashSync(logInData.username, 5) + bcrypt.hashSync(logInData.password, 5);
            let hash = str.replace(/[$,./]/g, '');
            const authToken = await this.authToken.findOne({ userId: user._id })
            const isTokenExpired = authToken.expiredAt < getCurrentTime();
            isTokenExpired ? hash = hash : hash = authToken.token;
            this.authToken.findByIdAndUpdate(authToken._id,
                {
                    userId: user._id,
                    token: hash,
                    expiredAt: setTokenLifeTime()
                },
                { new: true })
                .then(tokenData => {
                    response.status(200).send({
                        code: 200,
                        status: 'Success',
                        message: 'OK',
                        result: {
                            token: tokenData.token,
                            expiredAt: setTokenLifeTime(),
                        }
                    })
                })
        } else {
            next(new HttpException(404, 'Post not found'));
        }
    }


    private registering = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const registerData: Registration = request.body;
        const user = new this.user(registerData);
        user.save()
            .then(user => {
                response.status(201).send({
                    code: 201,
                    status: 'Success',
                    message: 'Created',
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