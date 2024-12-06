export class UpdateImageDto {

    readonly title: string;
    readonly content: string;
    readonly description: string;

    readonly price: number;
    readonly keywords: string[];
    readonly topics: string[];


    updatedAt: string;

    constructor(initData?: Partial<UpdateImageDto>) {
        this.init(initData);
    }

    init(initData?: Partial<UpdateImageDto>) {
        Object.assign(this, initData);
    }
}
