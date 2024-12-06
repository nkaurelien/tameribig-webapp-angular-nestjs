import {Connection} from 'mongoose';

import {SEARCH_COLLECTION_INDEX, SEARCH_MODEL_PROVIDER} from './constants';
import {MONGO_DB_PROVIDER} from '@databases/constants';
import {SearchSuggestionSchema} from '@api/Search/search-suggestion.schema';

export const searchProviders = [
    {
        provide: SEARCH_MODEL_PROVIDER,
        useFactory: (connection: Connection) =>
            connection.model(SEARCH_COLLECTION_INDEX, SearchSuggestionSchema),
        inject: [MONGO_DB_PROVIDER],
    },
];
