import userModel from '../models/user.model';
import User from '../interfaces/user.interface';
import { AuthorizeTokenHelper } from '../../rest/AnyBody/authToken.helper';
import * as crypto from 'crypto';
import { getCurrentTime } from '../../utils/current-time-UTC';

export class UserHelper extends AuthorizeTokenHelper {
	private user = userModel;
	constructor() {
		super();
	}

	public getUserById(id) {
		return this.user.findById(id).then((user) => {
			return this.parseUserModel(user);
		});
	}

	public getUserId(userProps: object) {
		return this.user.findOne(userProps).then((user) => user._id);
	}

	public getUser(userProps: object) {
		return this.user.findOne(userProps);
	}

	public createUser(userProps: object) {
		const user = new this.user(userProps);
		return user.save();
	}

	public parseUserModel(user: User) {
		return {
			id: user._id,
			username: user.username,
			fullName: user.fullName,
			email: user.email,
			role: user.role,
			location: user.location,
			birthday: user.birthday,
			phone: user.phone,
			image: user.image,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			deletedAt: user.deletedAt,
			deletedBy: user.deletedBy
		};
	}

	public updateAuthorizedUser(bearerToken: string, data: object) {
		return super.getItem(bearerToken).then((doc) => {
			return this.updateUserItem(doc.userId, data);
		});
	}

	public updateUserItem(id, data: object) {
		return this.user
			.findByIdAndUpdate(id, { $set: Object.assign(data, { updatedAt: getCurrentTime() }) }, { new: true })
			.then((user) => {
				return this.parseUserModel(user);
			})
			.catch((error) => {
				return error;
			});
	}

	public removeUser(id: string) {
		return this.user.findByIdAndDelete(id);
	}

	public paginateUser(condition: object, page: number, limit: number) {
		return this.user.paginate({}, { page: +page || 1, limit: +limit || 20, sort: condition });
	}

	public clearAuthToken(id) {
		return super.removeItem(id);
	}

	public checkPasswordValid(id, password: string) {
		return this.user.findById(id).then((user) => {
			return this.createPasswordHash(password) === user.passwordHash;
		});
	}
	public createPasswordHash(password) {
		const sha256 = crypto.createHash('sha256');
		const hash = sha256.update(password).digest('base64');
		return hash;
	}

	public checkKeyForUpdating(id, key: string, value) {
		let obj = {};
		obj[key] = value;
		return this.getUser(obj).then((user) => {
			if (user && user._id != id && user[key] == value) {
				return false;
			} else {
				return true;
			}
		});
	}
}
