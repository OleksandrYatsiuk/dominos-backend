import { Model } from './base.interface'

export interface Chat extends Model {
    sender: string;
    message: string
    room: string;
}