export interface Delivery {
    id: string,
    firstName: string,
    phone: number,
    email: string,
    pizzaIds: string[],
    shop: string,
    address?: {
        street: string,
        house: number,
        entrance?: string,
        code?: number,
        floor?: number,
    },
    comment: string,
    date: {
        date: string,
        time: string
    },
    payment: {
        coupon?: string,
        remainder?: string
        type: string
    },
    image: string | null,
    amount: number,
    createdAt: number,
    updatedAt: number,
    deletedAt: number | null,
    deletedBy: string | null,
}