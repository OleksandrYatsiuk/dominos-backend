import * as express from 'express';
import Controller from './Controller';
import { UserManagementValidator } from '../validator/user-management.validator';
import * as multer from 'multer';
import AmazoneService from '../../services/AmazoneService';
import AnyBodyValidator from '../validator/any-body.validator';
import { UserModel } from '../models/user.model';
import { AccessTokenModel } from '../models/accessToken.model';

const upload = multer();

export class UserController extends Controller {
	public path = '/user';
	private helper = new UserModel();
	private access = new AccessTokenModel();
	private storage = new AmazoneService();
	private customValidator = new AnyBodyValidator()
	private customManagementValidator = new UserManagementValidator()

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.put(`${this.path}/profile`, super.checkAuth(), super.validate(this.customManagementValidator.update), this.update);
		this.router.put(`${this.path}/location`, super.checkAuth(), super.validate(this.customManagementValidator.updateLocation), this.updateLocation);
		this.router.get(`${this.path}/current`, super.checkAuth(), this.current);
		this.router.post(`${this.path}/logout`, super.checkAuth(), this.logout);
		this.router.post(`${this.path}/change-password`, super.checkAuth(), super.validate(this.customValidator.changePassword), this.changePassword);
		this.router.post(`${this.path}/upload`, super.checkAuth(), this.multer.any(), this.upload);
	}

	private update = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const updatedData = request.body;
		this.helper.checkKeyForUpdating(response.locals, 'username', updatedData.username).then((result) => {
			if (!result) {
				next(
					super.send422(
						super.custom('username', this.list.UNIQUE_INVALID, [
							{ value: 'Username' },
							{ value: updatedData.username }])
					)
				);
			} else {
				this.helper.checkKeyForUpdating(response.locals, 'email', updatedData.email).then((result) => {
					if (!result) {
						next(
							super.send422(
								super.custom('email', this.list.UNIQUE_INVALID, [
									{ value: 'Email' },
									{ value: updatedData.email }]
								)
							));
					} else {
						this.helper
							.updateUserItem(response.locals, updatedData)
							.then((user) => super.send200(response, this.helper.parseModel(user)))
							.catch((err) => next(super.send500(err)));
					}
				});
			}
		});
	};
	private updateLocation = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.helper
			.updateUserItem(response.locals, { location: request.body })
			.then((user) => super.send200(response, this.helper.parseModel(user)))
			.catch((err) => next(super.send500(err)));
	};

	private current = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.helper
			.getUserById(response.locals)
			.then((user) => super.send200(response, this.helper.parseModel(user)))
			.catch((err) => next(super.send404('User')));
	};

	private logout = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		this.access.model.remove({ userId: response.locals })
			.then(res => super.send204(response))
			.catch(err => super.send401(response));
	};
	private changePassword = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const { currentPassword, newPassword, confirmPassword } = request.body;
		if (newPassword !== confirmPassword) {
			next(
				super.send422(
					super.custom('confirmPassword', this.list.COMPARE_EQUAL, [
						{ value: 'Confirm Password' },
						{ value: 'New Password' }]
					))
			);
		} else {
			this.helper.isPassValid(response.locals, currentPassword).then((result) => {
				if (result) {
					this.helper
						.updateUserItem(response.locals, { passwordHash: this.helper.createPasswordHash(newPassword) })
						.then(() => super.send204(response));
				} else {
					next(
						super.send422(
							super.custom('currentPassword', this.list.EXIST_INVALID, [
								{ value: 'Current Password' }]
							))
					);

				}
			});
		}
	};

	private upload = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = response.locals;
		this.storage.uploadFile(request.files[0])
			.then(s3 => {
				this.helper
					.updateUserItem(id, { image: s3['Location'] })
					.then((user) => super.send200(response, user))
					.catch((err) => next(super.send500(err)));
			})
			.catch(e => next(this.send500(e)))
	};
}
