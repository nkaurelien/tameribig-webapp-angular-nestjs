// import admin = require('firebase-admin');
import {FireUserHelpers} from './firebase-user.helpers';
import {Body, Controller, Get, Param, Post, Put, Request, Response, UseGuards} from '@nestjs/common';
import {ResponseUtils} from '@core/utils';
import {AuthGuard} from '@nestjs/passport';
import {AuthUserService} from './auth-user.service';
import {AuthRoutesToken} from './auth.constant';
import {NotificationsService} from "@api/Notifications/notifications.service";
import {UpdateUserDto} from "@api/Users/dto/update-user.dto";
import {BugsnagService} from '@nkaurelien/nest-bugsnag';

@Controller(`/${AuthRoutesToken.root}`)
export class LoginController {

    constructor(
        private readonly authUserService: AuthUserService,
        private readonly notificationsService: NotificationsService,
        private readonly logger: BugsnagService,
    ) {
    }


    @UseGuards(AuthGuard('local-firebase'))
    @Post('login/firebase/token')
    async loginViaFirebaseGetAccessToken(@Request() req) {
        // return this.authUserService.login(req.user);
    }


    @UseGuards(AuthGuard('passport-firebase'))
    @Post('login/firebase')
    async loginViaFirebase(@Request() req, @Response() res) {
        return ResponseUtils.sendResponse(res, {...req.user});
    }


    @UseGuards(AuthGuard('passport-firebase'))
    @Get('notifications')
    async findNotifications(@Request() req, @Response() res): Promise<any> {
        // console.log('params.id', params.id);

        // Mongo DB
        const data = await this.notificationsService.find({
            notifiableId: req.user.uid,
            notifiableType: 'Auth.User',
        });
        return ResponseUtils.sendResponse(res, {
            read: (data || []).filter(item => item.readAt !== undefined && item.readAt !== null),
            unread: (data || []).filter(item => item.readAt === undefined || item.readAt === null),
        });
    }

    @UseGuards(AuthGuard('passport-firebase'))
    @Get('me')
    async updateUser(@Request() req, @Response() res) {
        try {

            // Mongo DB
            const data = await this.authUserService.usersService.findByNameOrID(req.user.uid);
            return ResponseUtils.sendResponse(res, {...req.user, ...data});
        } catch (error) {
            if (error.code === 'auth/id-token-revoked') {
                // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
            } else {
                // Token is invalid.
            }
            return ResponseUtils.sendError(res, error, 'Auth Error on user:');

        }
    }

    @UseGuards(AuthGuard('passport-firebase'))
    @Put('me')
    async user(@Request() req, @Response() res, @Body() body: UpdateUserDto) {
        try {

            // Mongo DB
            await this.authUserService.usersService.updateOneOrCreate({uid: req.user.uid}, body);
            const data = await this.authUserService.usersService.findByNameOrID(req.user.uid);
            // console.log({data, body});
            return ResponseUtils.sendResponse(res, {...req.user, ...data});
        } catch (error) {
            if (error.code === 'auth/id-token-revoked') {
                // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
            } else {
                // Token is invalid.
            }
            return ResponseUtils.sendError(res, error, 'Auth Error on user:');

        }
    }


    @Get([`/${AuthRoutesToken.someUser}`, `/${AuthRoutesToken.someUserAlt}`])
    async publicProfileByUid(@Param() params, @Response() res) {
        try {

            const userRecord = await FireUserHelpers.getUser(params.uid);

            // console.log({ params, userRecord});
            // Mongo DB
            const data = await this.authUserService.usersService.findByNameOrID(params.uid);

            return ResponseUtils.sendResponse(res, {...userRecord.toJSON(), ...data});
        } catch (error) {
            return ResponseUtils.sendError(res, error, 'Auth Error on user:');
        }
    }
}
