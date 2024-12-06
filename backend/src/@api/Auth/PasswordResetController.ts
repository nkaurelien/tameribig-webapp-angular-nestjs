// import admin = require('firebase-admin');
import {FireUserHelpers} from './firebase-user.helpers';
import {Body, Controller, Post, Request, Response} from '@nestjs/common';
import {ResponseUtils} from '@core/utils';
import {AuthUserService} from './auth-user.service';
import {AuthRoutesToken} from './auth.constant';
import {NotificationsService} from "@api/Notifications/notifications.service";
import {MailerService} from "@nestjs-modules/mailer";


// Email functionality
// const nodemailer = require('nodemailer');
//
// // Pull the gmail login info out of the environment variables
// // const gmailEmail = functions.config().gmail.email;
// // const gmailPassword = functions.config().gmail.password;
//
// // Configure the nodemailer with our gmail info
// const mailTransport = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'gmailEmail',
//         pass: 'gmailPassword',
//     },
// });


@Controller(`/${AuthRoutesToken.root}`)
export class PasswordResetController {

    constructor(
        private readonly authUserService: AuthUserService,
        private readonly notificationsService: NotificationsService,
        private readonly mailerService: MailerService,
    ) {
    }


    @Post('password/email-link')
    async sendResetLink(@Body() body: any, @Request() req, @Response() res) {

        try {
            const usremail = body.email;
            const auth = await FireUserHelpers.auth();
            const userRecord = await FireUserHelpers.getUserByEmail(usremail);

            const continueUrl = req.headers['origin'] + '/auth/login';

            // actionCodeSettings.url = continueUrl;
            const link = await auth.generatePasswordResetLink(usremail, actionCodeSettings);

            this.sendPasswordResetEmail(userRecord, link);

            return ResponseUtils.sendResponse(res, null);

        } catch (error) {
            return ResponseUtils.sendError(res, error, 'Password Reset Error');
        }

    }


    private sendPasswordResetEmail(userRecord, link) {

        this
            .mailerService
            .sendMail({
                to: `"${userRecord.displayName} <${userRecord.email}>"`, // list of receivers
                // from: 'noreply@tamerig.com', // sender address
                subject: 'Recupération de compte sur TAMERI BIG ✔', // Subject line
                // text: 'welcome', // plaintext body
                html: `<b> Cliquez sur le lien pour 
                            <a href="${link}">recuperer</a> 
                             votre compte <br> <br>
                            <small style="color: #222222;">${link}</small>
                          </b>`, // HTML body content
                // template: 'welcome', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
                // context: {  // Data to be sent to template engine.
                //     code: 'cf1a3f828287',
                //     username: 'john doe',
                // },
            })
            .then(() => {
            })
            .catch((reason) => {
                console.error('Password reset Email send Error', {reason})
            });

    }

}

const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for
    // this URL must be whitelisted in the Firebase Console.
    url: 'http://localhost',
    // This must be true for email link sign-in.
    // handleCodeInApp: true,
    // iOS: {
    //     bundleId: 'com.example.ios'
    // },
    // android: {
    //     packageName: 'com.example.android',
    //     installApp: true,
    //     minimumVersion: '12'
    // },
    // FDL custom domain.
    // dynamicLinkDomain: 'coolapp.page.link'
};
