import { Model } from './base.interface';

export interface Promotion extends Model {
    title: string;
    description: string;
    image: string;
    status: PromotionStatuses;
    endedAt: Date;
    startedAt: Date;
}

export class ModelPromotion {
    id: string;
    title: string;
    description: string;
    image: string;
    status: PromotionStatuses;
    endedAt: Date;
    startedAt: Date;
    createdAt: number;
    updatedAt: number;
    constructor({
        id = null,
        _id = null,
        title = null,
        description = null,
        image = null,
        status = null,
        endedAt = null,
        startedAt = null,
        createdAt = null,
        updatedAt = null
    }: Partial<Promotion> = {}) {
        this.id = id || _id;
        this.title = title;
        this.description = description;
        this.image = image;
        this.status = status;
        this.endedAt = endedAt;
        this.startedAt = startedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export enum PromotionStatuses {
    New = 1,
    Active = 2,
    Deactivate = 3,
    Finished = 4
}

export const PromotionStatusesMap = {
    [PromotionStatuses.New]: 'New',
    [PromotionStatuses.Active]: 'Active',
    [PromotionStatuses.Deactivate]: 'Deactivate',
    [PromotionStatuses.Finished]: 'Finished'
};
