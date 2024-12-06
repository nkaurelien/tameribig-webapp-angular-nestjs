import {Body, Controller, Get, Param, Post, Put, Request, Response, UseGuards} from '@nestjs/common';
import {UsersService} from '@api/Users/users.service';
import {UpdateUserDto} from '@api/Users/dto/update-user.dto';
import {CreateCustomerDto} from '@api/Users/dto/create-customer.dto';
import {ResponseUtils} from '@core/utils';
import {NotificationsService} from '@api/Notifications/notifications.service';
import {AuthGuard} from '@nestjs/passport';

// import * as uuidv4 from 'uuid/v4';
@Controller('users')
export class UserController {
    constructor(
        private readonly usersService: UsersService,
        private readonly notificationsService: NotificationsService,
    ) {
    }

    @UseGuards(AuthGuard('passport-firebase'))
    @Put(':id')
    async updateOne(@Param() params, @Body() body: UpdateUserDto, @Request() req, @Response() res): Promise<any> {
        // console.log(params.id);
        try {

            if (req.user.uid !== params.id) {
                throw new Error('Access denied');
            }

            body.updatedAt = (new Date()).toLocaleString();
            // Mongo DB
            await this.usersService.update({uid: params.id}, body);
            const data = await this.usersService.findByNameOrID(params.id);
            return ResponseUtils.sendResponse(res, data);
        } catch (error) {
            return ResponseUtils.sendError(res, error);
        }
    }

    @Post()
    async create(@Body() body: CreateCustomerDto): Promise<any> {
        // console.log(params.id);

        const username = body.email.split('@')[0].toLowerCase();
        const uuidv4 = require('uuid/v4');
        body.uid = uuidv4();
        body.username = username;
        body.createdAt = (new Date()).toLocaleString();
        // Mongo DB
        return await this.usersService.create(body);
    }

    @UseGuards(AuthGuard('passport-firebase'))
    @Get(':id')
    async findOne(@Param() params, @Response() res): Promise<any> {
        // console.log('params.id', params.id);

        // FIrebase
        // return this.usersService.findOne(params.id);

        // Mongo DB
        const data = await this.usersService.findByNameOrID(params.id);
        return ResponseUtils.sendResponse(res, data);
    }

    @UseGuards(AuthGuard('passport-firebase'))
    @Get(':id/notifications')
    async findNotifications(@Param() params, @Response() res): Promise<any> {
        // console.log('params.id', params.id);

        // Mongo DB
        const data = await this.notificationsService.find({
            notifiableId: params.id,
            notifiableType: 'Auth.User',
        });
        return ResponseUtils.sendResponse(res, data);
    }
}
