import {Md5} from 'ts-md5/dist/md5';
import {SearchSuggestionType} from '../search-suggestion.interface';

export class CreateSearchSuggestionDto {
    search: string;
    searchMd5?: string;
    type?: SearchSuggestionType;
    useCount?: number;
    createdAt?: string;
    lastUsedAt?: string;

    constructor(initData?: Partial<CreateSearchSuggestionDto>) {
        this.init(initData);

        this.createdAt = (new Date()).toISOString();
        this.lastUsedAt = (new Date()).toISOString();
        this.type = SearchSuggestionType.Text;
        this.useCount = 1;
        if (this.search) {
            this.searchMd5 = Md5.hashStr(this.search).toString();
        }
    }

    init(initData?: Partial<CreateSearchSuggestionDto>) {
        Object.assign(this, initData);
    }
}
