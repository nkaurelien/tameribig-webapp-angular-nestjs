export class UpdateUserDto {
    readonly displayName: string;
    readonly roles?: string[];
    readonly photoUrl?: string;
    readonly about?: string;
    readonly occupation?: string;
    updatedAt: string;

    readonly socialLinks?: {
        readonly facebook: string;
        readonly youtube?: string;
        readonly dribbble?: string;
        readonly linkedin?: string;
        readonly twitter?: string;
        readonly instagram?: string;
    };

    readonly address?: {
        readonly street?: string;
        readonly locality: string;
        readonly city: string;
        readonly region?: string;
        readonly country?: string;
        readonly postalCode?: string;
    };

    constructor(initData?: Partial<UpdateUserDto>) {
        this.init(initData);
    }

    init(initData?: Partial<UpdateUserDto>) {
        Object.assign(this, initData);
    }
}
