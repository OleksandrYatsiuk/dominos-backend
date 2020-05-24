import * as express from 'express';
import Controller from '../../interfaces/controller.interface';
import { code200, code204, code401, code500 } from '../../middleware/base.response';
import validate from '../../middleware/validation.middleware';
import { update, updateLocation } from '../UserManagement/UserManagement.validator';
import checkAuth from '../../middleware/auth.middleware';
import UnprocessableEntityException from '../../exceptions/UnprocessableEntityException';
import { changePassword } from '../AnyBody/Register.validator';
import * as multer from 'multer';
import checkFiles from '../../validations/Files.validator';
import AmazoneService from '../../services/AmazoneService';
import { UserHelper } from './user.helper';

const upload = multer();

export default class UserController implements Controller {
    public path = '/user';
    public router = express.Router();
    private helper = new UserHelper();
    private storage = new AmazoneService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.put(`${this.path}/profile`, checkAuth, validate(update), this.update);
        this.router.put(`${this.path}/location`, checkAuth, validate(updateLocation), this.updateLocation);
        this.router.get(`${this.path}/current`, checkAuth, this.current);
        this.router.post(`${this.path}/logout`, checkAuth, this.logout);
        this.router.post(`${this.path}/change-password`, checkAuth, validate(changePassword), this.changePassword);
        this.router.post(`${this.path}/upload`, checkAuth, upload.single('file'), checkFiles(), this.upload);
    }

    private update = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const updatedData = request.body;
        this.helper.checkKeyForUpdating(response.locals, 'username', updatedData.username).then(result => {
            if (!result) {
                next(new UnprocessableEntityException({ field: 'username', message: `Username"${updatedData.username}" has already been taken.` }));
            } else {
                this.helper.checkKeyForUpdating(response.locals, 'email', updatedData.email).then(result => {
                    if (!result) {
                        next(new UnprocessableEntityException({ field: 'email', message: `Email "${updatedData.email}" has already been taken.` }))
                    } else {
                        this.helper.updateUserItem(response.locals, updatedData)
                            .then(user => code200(response, user))
                            .catch(err => code500(response, err))
                    }
                })
            }
        })
    }
    private updateLocation = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.helper.updateUserItem(response.locals, { location: request.body })
            .then(user => code200(response, user))
            .catch(err => code500(response, err))
    }

    private current = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.helper.getUserById(response.locals)
            .then(user => code200(response, user))
            .catch(err => code500(response, err));

    }

    private logout = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.helper.clearAuthToken(response.locals).then(result => {
            result ? code204(response) : code401(response);
        })
    }
    private changePassword = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { currentPassword, newPassword } = request.body;
        this.helper.checkPasswordValid(response.locals, currentPassword).then(result => {
            if (!result) {
                next(
                    new UnprocessableEntityException({
                        field: "currentPassword",
                        message: "Current Password is invalid."
                    })
                )
            } else {
                this.helper.updateUserItem(response.locals,
                    { passwordHash: this.helper.createPasswordHash(newPassword) })
                    .then(() => code204(response))
            }
        })
    }

    private upload = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = response.locals;
        this.storage.uploadFile(request.file)
            .then(s3 => {
                this.helper.updateUserItem(id, { image: s3["Location"] })
                    .then(user => code200(response, user))
                    .catch(err => code500(response, err))
            })
            .catch(err => {
                code500(response, err)
            })
    }
}