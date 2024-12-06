import {Controller, Get, Request} from '@nestjs/common';
import {AppService} from './app.service';
import {BugsnagLogger} from '@nkaurelien/nest-bugsnag';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly logger: BugsnagLogger,
    ) {
    }

    @Get()
    getHello(@Request() req): string {
        this.logger.log(this.appService.getHello());
        return this.appService.getHello();
    }
}
