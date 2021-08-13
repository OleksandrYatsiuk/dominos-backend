import { BaseModel } from "./base.model";
import schema from "./schemas/users.schema";
import * as crypto from 'crypto';
import { hash, compare, hashSync } from 'bcrypt';
import * as mongoose from 'mongoose';
import { User } from "../interfaces";
import { getCurrentTime } from "../../utils/current-time-UTC";

export class UserModel extends BaseModel {
    public model: mongoose.PaginateModel<User & mongoose.Document>|any;
    constructor() {
        super(schema)
        this.model = schema
    }

    public getListWithPagination(page: any, limit: any, sort: any) {
        return this.model.paginate({}, { page: +page || 1, limit: +limit || 20, sort: this.pagination(sort) })
    }

    public getUserById(id: User['id']) {
        return this.model.findById(id)
    }

    public getUser(option: string | object) {
        if (typeof option === 'string') {
            return this.model.findById(option)
        } else {
            return this.model.findOne(option)
        }

    }

    public createUser(user: User) {
        return this.model.create(user);
    }

    public updateUser(id: User['id'], data: User) {
        return super.update(id, data);
    }

    public parseModel(user: User) {
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
        };
    }

    public updateUserItem(id, data: object) {
        return this.model
            .findByIdAndUpdate(id, { $set: Object.assign(data, { updatedAt: getCurrentTime() }) }, { new: true })
    }

    public removeUser(id: string) {
        return this.model.findByIdAndDelete(id);
    }

    public paginateUser(condition: object, page: number, limit: number) {
        return this.model.paginate({}, { page: +page || 1, limit: +limit || 20, sort: condition });
    }


    public isPassValid(user: User, password: string): Promise<boolean> {
        return this.getUser(user).then(({ passwordHash }) => compare(password, passwordHash));
    }

    public createPasswordHash(password): string {
        return hashSync(password, 10);
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