import {Connection} from 'mongoose';

import {NOTIFICATION_COLLECTION_INDEX, NOTIFICATION_MODEL_PROVIDER} from './constants';
import {MONGO_DB_PROVIDER} from '@databases/constants';
import {NotificationsSchema} from "@api/Notifications/notifications.schema";

export const notificationsProviders = [
    {
        provide: NOTIFICATION_MODEL_PROVIDER,
        useFactory: (connection: Connection) =>
            connection.model(NOTIFICATION_COLLECTION_INDEX, NotificationsSchema),
        inject: [MONGO_DB_PROVIDER],
    },
];
