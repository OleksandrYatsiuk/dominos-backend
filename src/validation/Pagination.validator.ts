import * as Joi from "@hapi/joi";
import { PromotionStatuses } from "../rest/Promotions/promotions.interface";

export const pagination = Joi.object({
    page: Joi.number().optional().label('Page').min(1).default(1),
    limit: Joi.number().optional().label('Limit').min(1).default(20),
    sort: Joi.optional().label('Sorting').messages({
        'any.only': 'must be 1 or -1.'
    }),
    status: Joi.array().label('Status').items(
        Joi.number().valid(PromotionStatuses.New, PromotionStatuses.Active, PromotionStatuses.Deactivate, PromotionStatuses.Finished),
    )
})
