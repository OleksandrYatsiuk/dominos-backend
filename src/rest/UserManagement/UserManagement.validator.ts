import * as Joi from "@hapi/joi";
import { Roles } from "../../interfaces/roles.interface";

const phoneEqual = (value, helpers) => {
    if (value.toString().length != 12) {
        return helpers.error('number.invalid')
    }
}

export const usernameMinLength = 3;
export const usernameMaxLength = 15;
export const fullNameMinLength = 4;
export const fullNameMaxLength = 20;


export const update = Joi.object({
    username: Joi.string().optional().empty().label('Username').min(usernameMinLength).max(usernameMaxLength),
    fullName: Joi.string().optional().empty().label('Full Name').min(fullNameMinLength).max(fullNameMaxLength),
    email: Joi.string().optional().empty().label('Email').email(),
    birthday: Joi.string().optional().empty().label('Birthday').isoDate(),
    phone: Joi.number().optional().empty().custom(phoneEqual, 'phone count').label('Phone')
})

export const updateLocation = Joi.object({
    lat: Joi.number().required().empty().label('Latitude'),
    lng: Joi.number().required().empty().label('Longitude')
})



const checkRoles = (value: string, helpers) => {
    if (!Object.values(Roles).find(role => value === role)) {
        return helpers.error('any.invalid');
    }
}


export const updateRole = Joi.object({
    role: Joi.string().required().empty().label('Role').custom(checkRoles, 'role validation'),
})



