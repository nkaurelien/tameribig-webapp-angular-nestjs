import {Column, Entity} from 'typeorm';

import {PasswordTransformer} from '../../transformers/password.transformer';
import {RoleType} from '../../constants/role-type';

@Entity({name: 'users'})
export class UserEntity {
    @Column({nullable: true})
    firstName: string;

    @Column({nullable: true})
    lastName: string;

    @Column({type: 'enum', enum: RoleType, default: RoleType.User})
    role: RoleType;

    @Column({unique: true, nullable: true})
    email: string;

    @Column({nullable: true, transformer: new PasswordTransformer()})
    password: string;

    @Column({nullable: true})
    phone: string;

    @Column({nullable: true})
    avatar: string;
}
