export class CreateNotificationDto {

    uid: string;

    notifiableId: string;
    notifiableType: string;
    type: string;
    data?: any;
    readonly readAt: string;
    createdAt: string;

    constructor(initData?: Partial<CreateNotificationDto>) {
        this.init(initData);
    }

    init(initData?: Partial<CreateNotificationDto>) {
        Object.assign(this, initData);
    }
}
