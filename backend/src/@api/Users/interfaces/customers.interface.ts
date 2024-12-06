import {Document} from 'mongoose';

export interface Customer extends Document {
    readonly fullname: string;
    readonly displayName: string;
    readonly username: string;
    readonly uid: string;
    readonly email: string;
    readonly emailAuthHash: string;
    readonly phoneNumber?: string;
    readonly photoUrl?: string;
    readonly about?: string;
    readonly occupation?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    readonly deletedAt?: string;

    readonly roles?: string[];
    readonly permissions?: string[];

    readonly views?: {
        readonly images?: number;
        readonly creas?: number;
        readonly audios?: number;
        readonly videos?: number;
        readonly illustrations?: number;
        readonly users?: number;
    };

    readonly upvotes?: {
        readonly images?: number;
        readonly creas?: number;
        readonly audios?: number;
        readonly videos?: number;
        readonly illustrations?: number;
        readonly users?: number;
    };
}
