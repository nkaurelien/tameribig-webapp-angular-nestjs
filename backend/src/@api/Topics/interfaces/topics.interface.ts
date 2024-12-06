import {Document} from 'mongoose';

export interface Topics extends Document {

    readonly uid: string;
    readonly name: string;
    readonly picture: string;
    readonly miniature: string;
    readonly description: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    readonly deletedAt?: string;
}
