import * as Joi from "@hapi/joi";

export const promotion = Joi.object({
    title: Joi.string().required().label('Title').max(100),
    content: Joi.string().required().label('Content').max(2000),
    image: Joi.string().required().label('Image')
})

