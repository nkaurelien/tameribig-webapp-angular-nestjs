import {Author} from '../interfaces/images.interface';

export class CreateImageDto {
    uid: string;
    readonly title: string;
    readonly content: string;
    readonly description: string;
    readonly userId?: string;
    readonly fileName?: string;
    readonly picture?: string;
    readonly miniature?: string;

    readonly price: number;
    readonly keywords?: string[];

    topics?: string[];

    authorId?: string;
    author?: Author;

    createdAt?: string;

    constructor(initData?: Partial<CreateImageDto>) {
        this.createdAt = (new Date()).toISOString();
        this.init(initData);
    }

    init(initData?: Partial<CreateImageDto>) {
        Object.assign(this, initData);
    }
}
