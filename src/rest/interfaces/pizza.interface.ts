import { Model } from "./base.interface";

export interface Pizza extends Model {
	name: string;
	ingredients: any;
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
}
