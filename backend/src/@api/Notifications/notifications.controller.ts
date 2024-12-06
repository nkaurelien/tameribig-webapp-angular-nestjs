import {Controller, Delete, Get, Param, Put, Response} from '@nestjs/common';

import {ResponseUtils} from "@core/utils";
import {NotificationsService} from "@api/Notifications/notifications.service";

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {
    }

    @Delete(':id')
    async deleteOne(@Param() params, @Response() res): Promise<any> {

        // Mongo DB
        const data = await this.notificationsService.findByIdAndDelete(params.id);
        return ResponseUtils.sendResponse(res, data);
    }

    @Get(':id')
    async findOne(@Param() params, @Response() res): Promise<any> {
        // console.log('params.id', params.id);

        // Mongo DB
        const data = await this.notificationsService.findById(params.id);
        return ResponseUtils.sendResponse(res, data);
    }


    @Put(':id/mark-readed')
    async findByIdAndMarkReaded(@Param() params, @Response() res): Promise<any> {
        // console.log('params.id', params.id);

        // Mongo DB
        const data = await this.notificationsService.findByIdAndMarkReaded(params.id);
        return ResponseUtils.sendResponse(res, data);
    }
}
