import * as Joi from "@hapi/joi";
import { PromotionStatuses } from "./promotions.interface";

export const promotion = Joi.object({
    title: Joi.string().required().label('Title').max(100),
    content: Joi.string().required().label('Content').max(2000),
    image: Joi.string().optional().label('Image'),
    startedAt: Joi.number().required().label('Started Date'),
    status: Joi.number().label('Status').valid(PromotionStatuses.New, PromotionStatuses.Active, PromotionStatuses.Deactivate, PromotionStatuses.Finished)
})

