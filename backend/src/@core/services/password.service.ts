import {Injectable} from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PasswordService {

    /**
     * generates random string of characters i.e salt
     * @function
     * @param {number} length - Length of the random string.
     */
    public static generateRandomString(length: number) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length);   /** return required number of characters */
    }

    public static hash(password: string, salt?: string) {
        salt = salt || PasswordService.generateRandomString(128);
        return PasswordService.sha512(password, salt);
    }

    /**
     * hash password with sha512.
     * @function
     * @param {string} password - List of required fields.
     * @param {string} salt - Data to be validated.
     */
    private static sha512(password: string, salt: string) {
        const hash = crypto.createHmac('sha512', salt);
        /** Hashing algorithm sha512 */
        hash.update(password);

        const value = hash.digest('hex');

        return {salt, hash: value};
    }

}
