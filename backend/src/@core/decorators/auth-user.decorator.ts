import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const AuthUser = createParamDecorator((data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user[data] : request.user || {
        fullname: 'string',
        displayName: 'string',
        uid: 'string',
        email: 'string',
        avatar: 'string',
    };
});

export const AuthUserPublicInfo = createParamDecorator((data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const {displayName, uid, email, photoUrl} = request.user;
    const name = displayName || (email || '').split('@')[0];
    return {
        displayName: name,
        email,
        photoUrl,
        uid,
    };
});

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

export const AuthUserProperty = createParamDecorator((data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user[data];
});

export const AuthUserID = createParamDecorator((_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.uid || '';
});

export const AuthUserEmail = createParamDecorator((_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.email || '';
});
