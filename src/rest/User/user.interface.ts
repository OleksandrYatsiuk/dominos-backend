export default interface User {
    id: string,
    _id?: string,
    fullName: string,
    username: string,
    email: string
    passwordHash: string
    role: string,
    birthday?: string,
    phone: number,
    location: {
        lat: number,
        lng: number
    },
    image?: string | null,
    createdAt: number,
    updatedAt: number,
    deletedAt: number,
    deletedBy: number
}