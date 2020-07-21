export interface Registration extends Password {
    fullName: string,
    username: string,
    email: string
}
export interface Password {
    password: string,
    confirmPassword: string
}