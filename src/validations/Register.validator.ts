import * as Joi from "@hapi/joi";
import { min } from "moment";

export const registerSchema = Joi.object({
    username: Joi.string().required().label('Username').max(15).min(3).messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank.",
        'string.custom': "can not be blank.",
        "string.min": "must be no less than 3.",
        "string.max": "must be no greater than 15.",
    }),
    fullName: Joi.string().required().label('Full Name').max(20).min(4).messages({
        "string.base": "must be a string.",
        'any.required': "can not be blank.",
        'string.empty': "can not be blank.",
        "string.min": "must be no less than 4.",
        "string.max": "must be no greater than 20.",
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
    confirmPassword: Joi.string().required()
        .label("Confirm Password")
        .valid(Joi.ref('password')).messages({
            'any.required': "can not be blank.",
            'any.only': 'should be equal to "Password".'
        })
})

export const changePassword = Joi.object({
    currentPassword: Joi.string().required().label("Current Password").messages({
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    newPassword: Joi.string().required().label("New Password").messages({
        'any.required': "can not be blank.",
        'string.empty': "can not be blank."
    }),
    confirmPassword: Joi.string().required()
        .label("Confirm Password")
        .valid(Joi.ref('newPassword')).messages({
            'any.required': "can not be blank.",
            'any.only': 'should be equal to "New Password".'
        })
})

