export class CreateTopicDto {
    uid: string;
    readonly name: string;
    readonly picture: string;
    readonly miniature: string;
    readonly description: string;


    createdAt: string;

    constructor(initData?: Partial<CreateTopicDto>) {
        this.init(initData);
    }

    init(initData?: Partial<CreateTopicDto>) {
        Object.assign(this, initData);
    }
}
