import * as Joi from '@hapi/joi';
import { PizzaConfig } from './validatorConfig/index';
import { BaseValidator } from './base.validator';

export default class PizzaValidator extends BaseValidator {
	public config = new PizzaConfig();
	constructor() {
		super()
	}

	private name = this.val.string().required().label('Name').max(this.config.nameMaxLength).min(this.config.nameMinLength)
	private ingredients = this.val.array().items(this.val.string()).required().label('Ingredients')
	private weight = this.schema({
		small: this.val.number().required().label('Weight Small'),
		middle: this.val.number().required().label('Weight Middle'),
		big: this.val.number().required().label('Weight Big')
	}).required()
		.label('Weight')
	private price = this.schema({
		small: this.val.number().required().label('Weight Small'),
		middle: this.val.number().required().label('Weight Middle'),
		big: this.val.number().required().label('Weight Big')
	}).required().label('Price')

	private category = this.val.string().required().label('Category')


	public pizza = Joi.object({
		name: this.name,
		ingredients: this.ingredients,
		weight: this.weight,
		price: this.price,
		category: this.category
	});
}


