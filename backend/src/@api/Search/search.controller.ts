/* tslint:disable:no-console */
import {Body, Controller, Param, Post, Response} from '@nestjs/common';
import {ResponseUtils} from '@core/utils';
import {uniqBy} from 'lodash';
import {NotificationsService} from '@api/Notifications/notifications.service';
import {SearchService} from './search.service';
import {CreateSearchSuggestionDto} from './dto/create-search-suggestion.dto';
import {FindSearchSuggestionDto} from './dto/find-search-suggestion.dto';
import {sentimentAnalyze} from '@core/classes/Sentiment/Sentiment';
import {SearchSuggestionType} from './search-suggestion.interface';

// import * as uuidv4 from 'uuid/v4';
@Controller('search')
export class SearchController {
    constructor(
        private readonly searchService: SearchService,
        private readonly notificationsService: NotificationsService,
    ) {
    }

    @Post('suggestions/create')
    async create(@Body() body: CreateSearchSuggestionDto): Promise<any> {
        const data = new CreateSearchSuggestionDto(body);
        // Mongo DB
        return await this.searchService.createSuggestion(data, false);
    }

    @Post('suggestions')
    async atlasFullTextSearchAutocompleSuggestions(@Body() body: FindSearchSuggestionDto, @Param() params, @Response() res): Promise<any> {

        const query = new FindSearchSuggestionDto(body);

        const result = sentimentAnalyze(query.searchText);
        // const words = result.positive; // only positive word
        // const sentimentScore  = result.score;
        // const words = result.words;
        const words = result.tokens;
        // Mongo DB
        let native = await this.searchService.nativeFullTextSearchAutocompleSuggestions(words);
        // let  atlas = await this.searchService.atlasFullTextSearchAutocompleSuggestions(words);

        native = uniqBy(native, 'searchMd5');
        // atlas = uniqBy(atlas, 'searchMd5');

        return ResponseUtils.sendResponse(res, {/*atlas,*/ native});
    }

    @Post('images')
    async atlasFullTextSearchImages(@Body() body: FindSearchSuggestionDto, @Response() res): Promise<any> {
        const query = new FindSearchSuggestionDto(body);

        const result = sentimentAnalyze(query.searchText);
        const words = result.tokens;
        // Mongo DB
        const data = await this.searchService.atlasFullTextSearchImages(words);
        if (data && data.length) {
            this.searchService.findOneOrcreateSuggestion({searchMd5: query.searchMd5}, new CreateSearchSuggestionDto({
                search: query.searchText,
                searchMd5: query.searchMd5,
                type: SearchSuggestionType.Text,
            }))
                // .then(console.log);
                .then();
        }
        return ResponseUtils.sendResponse(res, data);
    }

}
