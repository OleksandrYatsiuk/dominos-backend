import { Model } from "./base.interface";

export interface Shop extends Model {
	address: string;
	lat: number;
	lng: string;
	draggable: string;
}
