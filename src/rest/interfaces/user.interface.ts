import { BaseModelInterface } from "../../interfaces/Base.interface";

export interface User extends BaseModelInterface {
    fullName: string,
    username: string,
    email: string
    passwordHash?: string;
    role?: string;
    birthday?: string;
    phone: string;
    location: {
        lat: number;
        lng: number
    }
    image?: string | null;
}