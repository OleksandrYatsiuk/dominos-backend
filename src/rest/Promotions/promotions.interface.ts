export interface Promotion {
    readonly _id?: string,
    title: string,
    content: string
    image: string,
    status: PromotionStatuses,
    startedAt: Date,
    createdAt: number,
    updatedAt: number,
}
export enum PromotionStatuses {
    New = 1,
    Active = 2,
    Deactivate = 3,
    Finished = 4
}