import * as Joi from "@hapi/joi";

export const pizza = Joi.object({
    name: Joi.string().required().label('Name').max(40).min(3).messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank.",
        "string.min": "must be no less than 3.",
        "string.max": "must be no greater than 40.",
    }),
    ingredients: Joi.array().items(Joi.string()).required().label("Ingredients").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    weight: Joi.object({
        small: Joi.number().required().label("Weight Small").messages({
            "number.empty": "cannot be blank.",
            'any.required': "can not be blank.",
        }),
        middle: Joi.number().required().label("Weight Middle").messages({
            "number.empty": "cannot be blank.",
            'any.required': "can not be blank.",
        }),
        big: Joi.number().required().label("Weight Big").messages({
            "number.empty": "cannot be blank.",
            'any.required': "can not be blank.",
        })
    }).required().label('Weight').messages({
        'any.required': "can not be blank.",
    }),
    price: Joi.object({
        low: Joi.number().required().label("Price Low").messages({
            "number.empty": "cannot be blank.",
            'any.required': "can not be blank.",
            'string.empty': "can not be blank."
        }),
        medium: Joi.number().required().label("Price Medium").messages({
            "number.empty": "cannot be blank.",
            'any.required': "can not be blank.",
            'string.empty': "can not be blank."
        }),
        high: Joi.number().required().label("Price High").messages({
            "number.empty": "cannot be blank.",
            'any.required': "can not be blank.",
            'string.empty': "can not be blank."
        })
    }).required().label('Price').messages({
        'any.required': "can not be blank.",
    }),
    category: Joi.string().required().label("Category").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    image: Joi.string().label("Image").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    })
})