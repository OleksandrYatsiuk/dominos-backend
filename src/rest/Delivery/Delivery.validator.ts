import * as Joi from "@hapi/joi";

export const delivery = Joi.object({
    firstName: Joi.string().required().label('First Name'),
    phone: Joi.number().required().label("Phone"),
    email: Joi.string().email().required().label("Email"),
    pizzaIds: Joi.array().items(Joi.string())
        .required().label("Pizza Ids"),
    userId: Joi.string(),
    shop: Joi.string().label("Shop"),
    address: Joi.object().label("Address"),
    comment: Joi.string().label("Comment"),
    date: Joi.object().keys({
        date: Joi.string().required(),
        time: Joi.string().required()
    }).label("Date"),
    payment: Joi.object().keys({
        coupon: Joi.string(),
        remainder: Joi.string(),
        type: Joi.string().required().valid('cash', 'card')
    }).label("Payment"),
    image: Joi.string().label("Image"),
    amount: Joi.number().required().label("Amount")
})