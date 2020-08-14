import * as mongoose from 'mongoose';
import { setSorting } from '../../utils/sortingHelper';
import { BaseModelInterface } from '../../interfaces/Base.interface';
import { getCurrentTime } from '../../utils/current-time-UTC';


export abstract class BaseModel {

    public mongoose = mongoose
    public model: mongoose.PaginateModel<mongoose.Document>
    constructor(model: mongoose.PaginateModel<mongoose.Document>) {
        this.model = model
    }

    public pagination(condition: any) {
        return setSorting(condition);
    }
    public isExist(conditions: object): Promise<boolean> {
        return this.model.exists(conditions)
    }
    public remove(id: BaseModelInterface['id']) {
        return this.model.findByIdAndDelete(id);
    }
    public update(id:BaseModelInterface['id'], data: object) {
        return this.model.findByIdAndUpdate(id, { $set: Object.assign(data, { updatedAt: getCurrentTime() }) }, { new: true })
    }
}