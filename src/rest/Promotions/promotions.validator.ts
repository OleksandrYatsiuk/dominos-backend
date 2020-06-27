import * as Joi from "@hapi/joi";

export const promotion = Joi.object({
    title: Joi.string().required().label('Title').max(100).min(10),
    content: Joi.string().required().label('Content').max(1000).min(20),
    image: Joi.string().required().label('Image')
})

