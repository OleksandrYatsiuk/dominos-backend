import { PaymentType } from '../interfaces/delivery.interface';
import { DeliveryConfig } from './validatorConfig/index';
import { BaseValidator } from './base.validator'

export default class DeliveryValidator extends BaseValidator {
	public config = new DeliveryConfig();


	public delivery = this.schema({
		firstName: this.val.string().required().label('First Name'),
		phone: this.val.number().required().label('Phone'),
		email: this.val.string().email().required().label('Email'),
		pizzaIds: this.val.array().items(this.val.string().label('Pizza Id')).required().label('Pizza Ids'),
		userId: this.val.string(),
		shopId: this.val.string().label('Shop Id').optional().allow(""),
		address: this.val.object().label('Address'),
		comment: this.val.string().optional().allow("").label('Comment'),
		date: this.schema({
			date: this.val.string().required().label('Date'),
			time: this.val.string().required().label('Time'),
		}).label('Date'),
		payment: this.schema({
			coupon: this.val.string().optional().allow(""),
			remainder: this.val.string().optional().allow(""),
			type: this.val.number().required().valid(PaymentType.Cash, PaymentType.Card).label('Payment Type')
		}).label('Payment'),
		image: this.val.string().label('Image'),
		amount: this.val.number().min(this.config.minLengthDeliveryAmount).required().label('Amount')
	});
}



