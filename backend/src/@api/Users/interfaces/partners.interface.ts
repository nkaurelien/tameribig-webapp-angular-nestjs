// import {Document} from 'mongoose';
import {Customer} from '@api/Users/interfaces/customers.interface';

export interface Partners extends Customer {
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

    readonly socialLinks?: {
        readonly facebook?: string;
        readonly youtube?: string;
        readonly twitter?: string;
    };

    readonly address?: {
        readonly street?: string;
        readonly locality: string;
        readonly city: string;
        readonly region?: string;
        readonly country?: string;
        readonly postalCode?: string;
    };
}
