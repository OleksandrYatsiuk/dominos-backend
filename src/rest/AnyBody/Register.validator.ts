import * as Joi from "@hapi/joi";
import { usernameMinLength, usernameMaxLength, fullNameMinLength, fullNameMaxLength } from "../../rest/UserManagement/UserManagement.validator";

export const registerSchema = Joi.object({
    username: Joi.string()
        .required()
        .label('Username')
        .min(usernameMinLength)
        .max(usernameMaxLength)
        .messages({
            "string.base": "must be a string.",
            'any.required': "can not be blank.",
            'string.empty': "can not be blank.",
            'string.custom': "can not be blank.",
            "string.min": `must be no less than ${usernameMinLength}.`,
            "string.max": `must be no greater than ${usernameMaxLength}.`,
        }),
    fullName: Joi.string()
        .required()
        .label('Full Name')
        .min(fullNameMinLength)
        .max(fullNameMaxLength)
        .messages({
            "string.base": "must be a string.",
            'any.required': "can not be blank.",
            'string.empty': "can not be blank.",
            "string.min": `must be no less than ${fullNameMinLength}.`,
            "string.max": `must be no greater than ${fullNameMaxLength}.`,
        }),
    email: Joi.string()
        .required()
        .label('Email')
        .messages({
            "string.base": "must be a string.",
            'any.required': "can not be blank.",
            'string.empty': "can not be blank.",
        }),
    password: Joi.string()
        .required()
        .label("Password")
        .messages({
            'any.required': "can not be blank.",
            'string.empty': "can not be blank."
        }),
    confirmPassword: Joi.string()
        .required()
        .label("Confirm Password")
        .valid(Joi.ref('password'))
        .messages({
            'any.required': "can not be blank.",
            'any.only': 'should be equal to "Password".'
        })
})

export const changePassword = Joi.object({
    currentPassword: Joi.string()
        .required()
        .label("Current Password")
        .messages({
            'any.required': "can not be blank.",
            'string.empty': "can not be blank."
        }),
    newPassword: Joi.string()
        .required()
        .label("New Password")
        .messages({
            'any.required': "can not be blank.",
            'string.empty': "can not be blank."
        }),
    confirmPassword: Joi.string().required()
        .label("Confirm Password")
        .valid(Joi.ref('newPassword'))
        .messages({
            'any.required': "can not be blank.",
            'any.empty': "can not be blank.",
            'any.only': 'should be equal to "New Password".'
        })
})

