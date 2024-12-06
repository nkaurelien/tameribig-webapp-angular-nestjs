import {Connection} from 'mongoose';

import {USER_COLLECTION_INDEX, USER_MODEL_PROVIDER} from './constants';
import {MONGO_DB_PROVIDER} from '@databases/constants';
import {UserSchema} from '@api/Users/users.schema';

export const usersProviders = [
    {
        provide: USER_MODEL_PROVIDER,
        useFactory: (connection: Connection) =>
            connection.model(USER_COLLECTION_INDEX, UserSchema),
        inject: [MONGO_DB_PROVIDER],
    },
];
