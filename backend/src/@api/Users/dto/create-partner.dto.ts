export class CreatePartnerDto {
    uid: string;
    readonly fullname: string;
    readonly displayName: string;
    readonly email: string;
    emailAuthHash?: string;
    readonly password: string;
    readonly roles?: string[];
    readonly photoUrl?: string;
    readonly about?: string;
    readonly occupation?: string;
    readonly createdAt: string;

    readonly socialLinks?: {
        readonly facebook: string;
        readonly youtube?: string;
        readonly twitter?: string;
    };

    readonly address?: {
        readonly street?: string;
        readonly locality: string;
        readonly city: string;
        readonly region?: string;
        readonly country?: string;
        readonly postalCode?: string;
    };

    constructor(initData?: Partial<CreatePartnerDto>) {
        this.init(initData);
    }

    init(initData?: Partial<CreatePartnerDto>) {
        Object.assign(this, initData);
    }
}
