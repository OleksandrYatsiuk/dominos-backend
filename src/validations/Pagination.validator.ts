import * as Joi from "@hapi/joi";

export const pagination = Joi.object({
    page: Joi.number().optional().label('Page').min(1).default(1).messages({
        "number.base": "must be a number.",
        "number.min": "must be larger than or equal to 1.",
    }),
    limit: Joi.number().optional().label('Limit').min(1).default(20).messages({
        "number.base": "must be a number.",
        "number.min": "must be larger than or equal to 1.",
    }),
    sort: Joi.optional().label('Sorting').messages({
        'any.only': 'must be 1 or -1.'
    })
})
