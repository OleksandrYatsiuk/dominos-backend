import * as Joi from "@hapi/joi";

export const delivery = Joi.object({
    firstName: Joi.string().required().label('First Name').messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    phone: Joi.number().label("Phone").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    email: Joi.string().email().required().label("Email").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    pizzasIds: Joi.array().items(Joi.string()).required().label("Pizza Ids").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
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

    }).required().label("Date").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    payment: Joi.object().keys({
    })
        .required().label("Payment").messages({
            "string.base": "must be a string.",
            'any.required': "can not be blank.",
            'string.empty': "can not be blank."
        }),
    image: Joi.string().label("Image").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    amount: Joi.number().label("Amount").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    })
})