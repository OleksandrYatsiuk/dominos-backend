import { Model } from './base.interface'

export interface Room extends Model {
    sender: any;
    receiver: any;
    lastMsgId: string
}