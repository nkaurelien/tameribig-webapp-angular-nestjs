import {Connection} from 'mongoose';

import {IMAGE_MODEL_PROVIDER, TOPICS_COLLECTION_INDEX, TOPICS_COLLECTION_PROVIDER,} from './topics.constants';
import {TopicSchema} from './topics.schema';
import {MONGO_DB_PROVIDER} from '@databases/constants';
import * as admin from "firebase-admin";
import {Provider} from "@nestjs/common";

export const topicsProviders: Provider[] = [
    {
        provide: IMAGE_MODEL_PROVIDER,
        useFactory: (connection: Connection) =>
            connection.model(TOPICS_COLLECTION_INDEX, TopicSchema),
        inject: [MONGO_DB_PROVIDER],
    },
    {
        provide: TOPICS_COLLECTION_PROVIDER,
        useFactory: () => {
            const db = admin.firestore();
            return db.collection(TOPICS_COLLECTION_INDEX);
        },
    },
];
