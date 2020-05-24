import * as Joi from "@hapi/joi";

export const delivery = Joi.object({
    firstName: Joi.string().required().label('First Name').messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    phone: Joi.number().required().label("Phone").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    email: Joi.string().email().required().label("Email").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    pizzaIds: Joi.array().items(Joi.string())
        .required().label("Pizza Ids").messages({
            "string.base": "must be a string.",
            'any.required': "can not be blank.",
            'string.empty': "can not be blank."
        }),
    userId: Joi.string(),
    shop: Joi.string().label("Shop").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    address: Joi.object().label("Address").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    comment: Joi.string().label("Comment").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    date: Joi.object().keys({
        date: Joi.string().required(),
        time: Joi.string().required()
    }).label("Date").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    payment: Joi.object().keys({
        coupon: Joi.string(),
        remainder: Joi.string(),
        type: Joi.string().required().valid('cash', 'card')
    }).label("Payment").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    image: Joi.string().label("Image").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    amount: Joi.number().required().label("Amount").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    })
})