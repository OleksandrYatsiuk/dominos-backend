import * as Joi from '@hapi/joi';
import { PaymentType } from './delivery.interface';

export const delivery = Joi.object({
	firstName: Joi.string().required().label('First Name'),
	phone: Joi.number().required().label('Phone'),
	email: Joi.string().email().required().label('Email'),
	pizzaIds: Joi.array().items(Joi.string().label('Pizza Id')).required().label('Pizza Ids'),
	userId: Joi.string(),
	shopId: Joi.string().label('Shop Id').optional().allow(""),
	address: Joi.object().label('Address'),
	comment: Joi.string().optional().allow("").label('Comment'),
	date: Joi.object()
		.keys({
			date: Joi.string().required().label('Date'),
			time: Joi.string().required().label('Time'),
		})
		.label('Date'),
	payment: Joi.object()
		.keys({
			coupon: Joi.string().optional().allow(""),
			remainder: Joi.string().optional().allow(""),
			type: Joi.number().required().valid(PaymentType.Cash, PaymentType.Card).label('Payment Type')
		})
		.label('Payment'),
	image: Joi.string().label('Image'),
	amount: Joi.number().min(0).required().label('Amount')
});
