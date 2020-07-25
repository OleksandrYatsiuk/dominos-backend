export interface Pizza {
	readonly id: string;
	readonly _id: string;
	name: string;
	ingredients: string[];
	weight: {
		small: number;
		middle: number;
		big: number;
	};
	price: {
		small: number;
		middle: number;
		big: number;
	};
	category: string;
	image: string | null;
	createdAt: number;
	updatedAt: number;
	deletedAt: number | null;
	deletedBy: string | null;
}
