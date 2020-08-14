import { BaseModelInterface } from "../../interfaces/Base.interface";

export interface TokenData extends BaseModelInterface {
    userId: string;
    token: string;
    expiredAt: number;
}