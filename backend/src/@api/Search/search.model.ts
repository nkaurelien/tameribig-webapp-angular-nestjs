import {MongooseModule} from '@nestjs/mongoose';
import {SEARCH_MODEL_PROVIDER} from '@api/Search/constants';
import {SearchSuggestionSchema} from '@api/Search/search-suggestion.schema';

export const SearchModel = MongooseModule.forFeature([
    {name: SEARCH_MODEL_PROVIDER, schema: SearchSuggestionSchema},
]);
