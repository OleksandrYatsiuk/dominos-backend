import { Model } from "./base.interface";

export interface TokenData extends Model {
    userId: string;
    token: string;
    expiredAt: number;
}