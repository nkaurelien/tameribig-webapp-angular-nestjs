export class UpdateSearchSuggestionDto {
    useCount?: number;
    lastUsedAt?: string;

    constructor(initData?: Partial<UpdateSearchSuggestionDto>) {
        this.init(initData);
        this.lastUsedAt = (new Date()).toISOString();
    }

    init(initData?: Partial<UpdateSearchSuggestionDto>) {
        Object.assign(this, initData);
    }
}
