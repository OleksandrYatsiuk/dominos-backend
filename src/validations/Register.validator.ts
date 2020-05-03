import user from "../models/user.model";
import * as Joi from "@hapi/joi";
import UnprocessableEntityException from "../exceptions/UnprocessableEntityException";




export const registerSchema = Joi.object({
    username: Joi.string().required().label('Username').messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank.",
        'string.custom': "can not be blank.",
    }),
    fullName: Joi.string().required().label('Full Name').messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank.",
    }),
    email: Joi.string().required().label('Email').messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank.",
    }),
    password: Joi.string().required().label("Password").messages({
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    confirmPassword: Joi.string().required().label("Confirm Password").messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    })
})
