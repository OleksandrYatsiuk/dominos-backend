export default interface User {
    id: string,
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
    createdAt: number,
    updatedAt: number,
    deletedAt: number,
    deletedBy: number
}