import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const Lang = createParamDecorator((data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (request.headers['accept-language'] || 'en').substring(0, 2);
});
