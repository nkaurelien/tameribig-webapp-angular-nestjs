import {Document} from 'mongoose';

export interface Notifications extends Document {
    readonly uid: string;
    readonly notifiableId: string;
    readonly notifiableType: string;
    readonly type: string;
    readonly data?: any;
    readonly readAt: string;
    readonly createdAt: string;

}
