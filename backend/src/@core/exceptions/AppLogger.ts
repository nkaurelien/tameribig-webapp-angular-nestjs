import {Logger, LoggerService} from '@nestjs/common';

export class AppLogger extends Logger implements LoggerService {
    log(message: any) {
        // add your tailored logic here
        super.error(message);
    }

    error(message: any, trace: string) {
        // add your tailored logic here
        // TODO Log to bugsnag
        super.error(message, trace);
    }

    warn(message: any) {
        // add your tailored logic here
        super.error(message);
    }

    debug(message: any) {
        // add your tailored logic here
        super.error(message);
    }

    verbose(message: any) {
        // add your tailored logic here
        super.error(message);
    }
}

// const debug = require('debug')('main.ts')
// debug('serviceAccount %s', serviceAccount)

// const winston = require('winston');
// winston.log('info', 'serviceAccount', serviceAccount);
