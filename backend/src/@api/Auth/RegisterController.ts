import {FireUserHelpers} from './firebase-user.helpers';
import {Body, Controller, Post, Response} from '@nestjs/common';
import {ResponseUtils} from '@core/utils';
import {CreateCustomerDto} from "@api/Users/dto/create-customer.dto";
import {AuthRoutesToken} from "@api/Auth/auth.constant";
import {NotificationsService} from "@api/Notifications/notifications.service";
import {UsersService} from "@api/Users/users.service";

@Controller(`/${AuthRoutesToken.root}`)
export class RegisterController {

    constructor(
        // private readonly authUserService: AuthUserService,
        private readonly usersService: UsersService,
        private readonly notificationsService: NotificationsService,
    ) {
    }

    @Post('register/firebase')
    async registerOnFireBase(@Body() body: CreateCustomerDto, @Response() res) {
        // const userId = 'some-uid';
        // const additionalClaims = {
        //     premiumAccount: false,
        // };

        try {

            const username = body.email.split('@')[0].toLowerCase();

            body.username = username;
            body.photoUrl = body.photoUrl || require('gravatar').url(body.email);
            body.createdAt = (new Date()).toLocaleString();


            // create account on firebase auth
            const userRecord = await FireUserHelpers.createUser(body);
            body.uid = userRecord.uid;

            // save in firestore
            // await this.authUserService.create(body);

            // Mongo DB
            await this.usersService.create(body);
            // const data = await this.authUserService.usersService.findByNameOrID(body.uid);

            return ResponseUtils.sendResponse(res, {...userRecord.toJSON()});

        } catch (error) {
            console.log('Error creating new user:', error);
            return ResponseUtils.sendError(res, error, 'Error creating new user:');
        }
    }
}
