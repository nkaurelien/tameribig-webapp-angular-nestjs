export class CreateCustomerDto {
    uid: string;
    username: string;
    photoUrl?: string;
    emailAuthHash?: string;
    readonly fullname: string;
    readonly email: string;
    readonly password: string;
    readonly phoneNumber?: string;
    readonly roles?: string[];
    createdAt: string;

    constructor(initData?: Partial<CreateCustomerDto>) {
        this.init(initData);
    }

    init(initData?: Partial<CreateCustomerDto>) {
        Object.assign(this, initData);
    }
}

/*
{
	"fullname": "string",
	"uid": "string",
	"email": "string",
	"password": "string",
	"avatar": "string",
	"roles": ["string", "string"],
	"createdAt": "string"
}
 */
