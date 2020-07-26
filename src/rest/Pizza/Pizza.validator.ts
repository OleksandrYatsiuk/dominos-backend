import * as Joi from '@hapi/joi';

export const pizza = Joi.object({
	name: Joi.string().required().label('Name').max(40).min(3),
	ingredients: Joi.array().items(Joi.string()).required().label('Ingredients'),
	weight: Joi.object({
		small: Joi.number().required().label('Weight Small'),
		middle: Joi.number().required().label('Weight Middle'),
		big: Joi.number().required().label('Weight Big')
	})
		.required()
		.label('Weight'),
	price: Joi.object({
		small: Joi.number().required().label('Weight Small'),
		middle: Joi.number().required().label('Weight Middle'),
		big: Joi.number().required().label('Weight Big')
	})
		.required()
		.label('Price'),
	category: Joi.string().required().label('Category')
});
