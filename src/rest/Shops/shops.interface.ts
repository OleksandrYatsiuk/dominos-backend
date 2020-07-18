export interface Shop {
	readonly id: string;
	readonly _id: string;
	address: string;
	lat: number;
	lng: string;
	label: string[];
	draggable: string;
	createdAt: number;
	updatedAt: number;
	deletedAt: number | null;
	deletedBy: string | null;
}
