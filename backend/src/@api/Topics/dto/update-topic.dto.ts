export class UpdateTopicDto {

    readonly name: string;
    readonly description: string;

    updatedAt: string;

    constructor(initData?: Partial<UpdateTopicDto>) {
        this.init(initData);
    }

    init(initData?: Partial<UpdateTopicDto>) {
        Object.assign(this, initData);
    }
}
