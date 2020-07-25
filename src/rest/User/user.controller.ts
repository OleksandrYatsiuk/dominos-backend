import * as express from 'express';
import Controller from '../Controller';
import { code200, code204, code401, code500 } from '../../middleware/base.response';
import validate from '../../middleware/validation.middleware';
import { update, updateLocation } from '../UserManagement/UserManagement.validator';
import checkAuth from '../../middleware/auth.middleware';
import UnprocessableEntityException from '../../exceptions/UnprocessableEntityException';
import { changePassword } from '../AnyBody/Register.validator';
import * as multer from 'multer';
import checkFiles from '../../validation/Files.validator';
import AmazoneService from '../../services/AmazoneService';
import { UserHelper } from './user.helper';

const upload = multer();

export default class UserController extends Controller {
	public path = '/user';
	private helper = new UserHelper();
	private storage = new AmazoneService();

	constructor() {
		super();
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
		this.helper.checkKeyForUpdating(response.locals, 'username', updatedData.username).then((result) => {
			if (!result) {
				next(
					new UnprocessableEntityException(
						this.validator.addCustomError('username', this.list.UNIQUE_INVALID, [
							{ value: 'Username' },
							{ value: updatedData.username }
						])
					)
				);
			} else {
				this.helper.checkKeyForUpdating(response.locals, 'email', updatedData.email).then((result) => {
					if (!result) {
						next(
							new UnprocessableEntityException(
								this.validator.addCustomError('email', this.list.UNIQUE_INVALID, [
									{ value: 'Email' },
									{ value: updatedData.email }
								])
							)
						);
					} else {
						this.helper
							.updateUserItem(response.locals, updatedData)
							.then((user) => code200(response, user))
							.catch((err) => code500(response, err));
					}
				});
			}
		});
	};
	private updateLocation = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.helper
			.updateUserItem(response.locals, { location: request.body })
			.then((user) => code200(response, user))
			.catch((err) => code500(response, err));
	};

	private current = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.helper
			.getUserById(response.locals)
			.then((user) => code200(response, user))
			.catch((err) => code500(response, err));
	};

	private logout = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.helper.clearAuthToken(response.locals).then((result) => {
			result ? code204(response) : code401(response);
		});
	};
	private changePassword = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { currentPassword, newPassword, confirmPassword } = request.body;
		if (newPassword !== confirmPassword) {
			next(
				new UnprocessableEntityException(
					this.validator.addCustomError('confirmPassword', this.list.COMPARE_EQUAL, [
						{ value: 'Confirm Password' },
						{ value: 'New Password' }
					])
				)
			);
		} else {
			this.helper.checkPasswordValid(response.locals, currentPassword).then((result) => {
				if (!result) {
					next(
						new UnprocessableEntityException(
							this.validator.addCustomError('currentPassword', this.list.EXIST_INVALID, [
								{ value: 'Current Password' }
							])
						)
					);
				} else {
					this.helper
						.updateUserItem(response.locals, { passwordHash: this.helper.createPasswordHash(newPassword) })
						.then(() => code204(response));
				}
			});
		}
	};

	private upload = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = response.locals;
		this.storage
			.uploadFile(request.file)
			.then((s3) => {
				this.helper
					.updateUserItem(id, { image: s3['Location'] })
					.then((user) => code200(response, user))
					.catch((err) => code500(response, err));
			})
			.catch((err) => {
				code500(response, err);
			});
	};
}
