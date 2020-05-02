export interface Authentication {
    username: string,
    password: string
}

export interface TokenData {
    id: string,
    userId: string,
    token: string,
    createdAt: number,
    expiredAt: number,
}