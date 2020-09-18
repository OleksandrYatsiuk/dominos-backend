import { Model } from './base.interface';

export interface Promotion extends Model {
    title: string;
    description: string;
    image: string;
    status: PromotionStatuses;
    startedAt: Date;
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
