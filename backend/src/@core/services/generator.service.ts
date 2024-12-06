import uuid from 'uuid/v1';
import {Injectable} from '@nestjs/common';

@Injectable()
export class GeneratorService {
    public uuid(): string {
        return uuid();
    }

    public fileName(ext: string) {
        return this.uuid() + '.' + ext;
    }

    public onesignalEmailAuthHash(email_address: string): string {
        const crypto = require('crypto');
        // const ONESIGNAL_REST_API_KEY = this.configService.getEnv('ONESIGNAL_REST_API_KEY');
        const hmac = crypto.createHmac('sha256', 'ONESIGNAL_REST_API_KEY');
        hmac.update(email_address);
        return hmac.digest('hex');
    }
}
