import { Model } from "./base.interface";

export interface Delivery extends Model {
	firstName: string;
	phone: number;
	email: string;
	pizzaIds: string[];
	shopId: string;
	address?: {
		street: string;
		house: number;
		entrance?: string;
		code?: number;
		floor?: number;
	};
	comment: string;
	date: {
		date: string;
		time: string;
	};
	payment: {
		coupon?: string;
		remainder?: string;
		type: PaymentType;
	};
	image: string | null;
	amount: number;
}

export enum PaymentType {
	Cash = 1,
	Card = 2
}

export const PaymentTypeMap = {
	[PaymentType.Cash]: 'Cash',
	[PaymentType.Card]: 'Card',
};