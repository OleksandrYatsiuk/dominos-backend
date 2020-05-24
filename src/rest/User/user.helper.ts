
import userModel from './user.model';
import User from './user.interface';
import { AuthorizeTokenHelper } from '../../rest/AnyBody/authToken.helper';
import * as bcrypt from 'bcrypt';
import { getCurrentTime } from '../../utils/current-time-UTC';

export class UserHelper extends AuthorizeTokenHelper {
    private user = userModel;
    constructor() {
        super()
    }

    public getUserById(id: string) {
        return this.user.findById(id).then(user => { return this.parseUserModel(user) });
    }
    public getUser(userProps: object) {
        return this.user.findOne(userProps);
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
        }
    }

    public updateAuthorizedUser(bearerToken: string, data: object) {
        return super.getItem(bearerToken).then(doc => {
            return this.updateUserItem(doc.userId, data);
        })
    }

    public updateUserItem(id: string, data: object) {

        return this.user.findByIdAndUpdate(id, { $set: Object.assign(data, { updatedAt: getCurrentTime() }) }, { new: true })
            .then(user => { return this.parseUserModel(user) })
            .catch(error => { return error; })
    }
    public clearAuthToken(id: string) {
        return super.removeItem(id);
    }

    public checkPasswordValid(id: string, password: string) {
        return this.user.findById(id).then(user => {
            return bcrypt.compareSync(password, user.passwordHash);
        })
    }
    public createPasswordHash(password) {
        return bcrypt.hashSync(password, 10);
    }

    public checkKeyForUpdating(id: string, key: string, value) {
        let obj = {};
        obj[key] = value
        return this.getUser(obj).then(user => {
            if (user && user._id != id && user[key] == value) {
                return false;
            } else {
                return true;
            }
        })
    }
}