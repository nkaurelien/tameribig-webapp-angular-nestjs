// import * as bcrypt from 'bcrypt';

export function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;

        return v.toString(16);
    });
}

export function syncTimeOut(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
    return password;
    // return bcrypt.hashSync(password, 10);
}

/**
 * generate random string
 * @param length
 */
export function generateRandomString(length: number) {
    return Math.random()
        .toString(36)
        .replace(/[^a-zA-Z0-9]+/g, '')
        .substr(0, length);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(password: string, hash: string): Promise<boolean> {
    return Promise.resolve(true);
    // return bcrypt.compare(password, hash || '');
}
