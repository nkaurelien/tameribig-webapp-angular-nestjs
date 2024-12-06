import {Md5} from 'ts-md5/dist/md5';

export class FindSearchSuggestionDto {
    search: string | string[];
    searchMd5?: string;
    lastUsedAt?: string;

    constructor(initData?: Partial<FindSearchSuggestionDto>) {
        this.init(initData);

        this.lastUsedAt = (new Date()).toISOString();
        if (this.search) {
            this.searchMd5 = Md5.hashStr(this.searchText).toString();
        }

    }

    get searchText(): string {

        if (Array.isArray(this.search)) {
            this.search = this.search.join(' ');
        }

        return this.search;
    }

    init(initData?: Partial<FindSearchSuggestionDto>) {
        Object.assign(this, initData);
    }
}
