export interface Shop {
    id: string,
    address: string,
    lat: number,
    lng: string,
    label: string[],
    draggable: string,
    createdAt: number,
    updatedAt: number,
    deletedAt: number | null,
    deletedBy: string | null,
}