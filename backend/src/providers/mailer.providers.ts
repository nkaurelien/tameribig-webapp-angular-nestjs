import {join} from 'path';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export class MailerProvider {
    static readonly forRootOptions = {
        transport: {
            host: 'smtp.mailtrap.io',
            port: 2525,
            ignoreTLS: true,
            secure: false,
            auth: {
                user: 'd2256be48fc416',
                pass: 'ca5d0a03df0517',
            },
        },
        defaults: {
            from: '"TAMERI BIG" <no-reply@tameribig.net>',
        },
        // preview: true,
        template: {
            dir: join(__dirname, 'resources/views/emails'),
            adapter: new HandlebarsAdapter(),
            options: {
                strict: true,
            },
        },
        options: {
            partials: {
                dir: join(__dirname, 'resources/views/_partials'),
                options: {
                    strict: true,
                },
            },
        },
    };
}
