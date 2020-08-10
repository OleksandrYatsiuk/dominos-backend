export interface Delivery {
	id: string;
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
	createdAt: number;
	updatedAt: number;
	deletedAt: number | null;
	deletedBy: string | null;
}
export enum PaymentType {
	Cash = 1,
	Card = 2
}

export const PaymentTypeMap = {
	[PaymentType.Cash]: 'Cash',
	[PaymentType.Card]: 'Card',
};