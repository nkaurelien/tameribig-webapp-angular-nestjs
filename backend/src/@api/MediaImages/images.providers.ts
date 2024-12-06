import {Connection} from 'mongoose';

import {IMAGE_COLLECTION_INDEX, IMAGE_COLLECTION_PROVIDER, IMAGE_MODEL_PROVIDER,} from './images.constants';
import {ImageSchema} from './images.schema';
import {MONGO_DB_PROVIDER} from '@databases/constants';
import * as admin from "firebase-admin";
import {Provider} from "@nestjs/common";

export const imagesProviders: Provider[] = [
    {
        provide: IMAGE_MODEL_PROVIDER,
        useFactory: (connection: Connection) =>
            connection.model(IMAGE_COLLECTION_INDEX, ImageSchema),
        inject: [MONGO_DB_PROVIDER],
    },
    {
        provide: IMAGE_COLLECTION_PROVIDER,
        useFactory: () => {
            const db = admin.firestore();
            return db.collection(IMAGE_COLLECTION_INDEX);
        },
    },
];
