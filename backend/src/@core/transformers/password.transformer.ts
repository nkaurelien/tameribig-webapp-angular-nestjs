import {ValueTransformer} from 'typeorm';
import {generateHash} from '@core/utils';

export class PasswordTransformer implements ValueTransformer {
    to(value) {
        return generateHash(value);
    }

    from(value) {
        return value;
    }
}
