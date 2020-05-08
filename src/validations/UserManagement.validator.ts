import * as Joi from "@hapi/joi";

export const update = Joi.object({
    username: Joi.string().optional().empty().label('Username').min(3).max(15).messages({
        "string.empty": "cannot be blank.",
        "string.min": "must be no less than 3.",
        "string.max": "must be no greater than 15.",
    }),
    fullName: Joi.string().optional().empty().label('Full Name').min(4).max(20).messages({
        "string.empty": "cannot be blank.",
        "string.min": "must be no less than 4.",
        "string.max": "must be no greater than 20.",
    }),
    email: Joi.string().optional().empty().label('Email').email().messages({
        "string.empty": "cannot be blank.",
        "string.email": "is invalid.",
    }),
    birthday: Joi.string().optional().empty().label('Birthday').isoDate().messages({
        "string.empty": "cannot be blank.",
        "string.isoDate": "format is invalid.",
    }),
    phone: Joi.number().optional().empty().label('Phone').messages({
        "number.empty": "cannot be blank.",
    })
})

export const updateLocation = Joi.object({
    lat: Joi.number().required().empty().label('Latitude').messages({
        "any.required": "cannot be blank.",
        "number.base": "must be a number.",
    }),
    lng: Joi.number().required().empty().label('Longitude').messages({
        "any.required": "cannot be blank.",
        "number.base": "must be a number.",
    })
})

export enum Roles {
    techadmin = "administrator",
    projectManager = 'projectManager',
    public = 'public'
}

const checkRoles = (value, helpers) => {
    if (!Object.values(Roles).find(role => value === role)) {
        return helpers.error('any.invalid');
    }
}


export const updateRole = Joi.object({
    role: Joi.string().required().empty().label('Role').custom(checkRoles, 'role validation').messages({
        "any.required": "cannot be blank.",
        "string.empty": "cannot be blank.",
        "any.invalid": "is invalid."
    }),
})

