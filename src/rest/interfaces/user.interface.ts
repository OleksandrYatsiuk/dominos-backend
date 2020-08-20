import { BaseModelInterface } from "../../interfaces/Base.interface";
import { Model } from "./base.interface";

export interface User extends Model {
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