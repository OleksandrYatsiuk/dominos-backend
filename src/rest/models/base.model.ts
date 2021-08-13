import * as mongoose from 'mongoose';
import { setSorting } from '../../utils/sortingHelper';
import { getCurrentTime } from '../../utils/current-time-UTC';
import { Model } from '../../rest/interfaces/base.interface';


export abstract class BaseModel {

    public mongoose = mongoose
    public model: mongoose.PaginateModel<mongoose.Document> | any
    constructor(model: mongoose.PaginateModel<mongoose.Document> | any) {
        this.model = model
    }

    public pagination(condition: any) {
        return setSorting(condition);
    }
    public isExist(conditions: object): Promise<boolean> {
        return this.model.exists(conditions)
    }
    public remove(id: Model['id']) {
        return this.model.findByIdAndDelete(id);
    }
    public update(id: Model['id'], data: object) {
        return this.model.findByIdAndUpdate(id, { $set: Object.assign(data, { updatedAt: getCurrentTime() }) }, { new: true })
    }
}