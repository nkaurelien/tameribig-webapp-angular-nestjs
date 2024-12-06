import admin = require('firebase-admin');
import uuid from 'uuid/v1';


async function auth(): Promise<admin.auth.Auth> {
    return admin.auth();
}

async function getUser(uid) {
    return admin.auth().getUser(uid);
}

async function getUserByPhoneNumber(phoneNumber) {
    return admin.auth().getUserByPhoneNumber(phoneNumber);
}

async function getUserByEmail(email) {
    return admin.auth().getUserByEmail(email);
}

async function createUser(data) {
    return await admin.auth().createUser({
        uid: uuid(),
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        displayName: data.fullname,
        photoURL: data.photoURL,
        emailVerified: false,
        disabled: false,
    });
}

async function updateUser(uid, data) {
    return await admin.auth().updateUser(uid, {
        email: data.email,
        phoneNumber: data.telehone,
        password: data.password,
        displayName: data.fullname,
        // photoURL: data.telehone,
        emailVerified: false,
        disabled: false,
    });
}

async function verifyIdToken(idToken: string, checkRevoked = false) {
    admin.auth().verifyIdToken(idToken, checkRevoked);
    return await admin.auth().verifyIdToken(idToken);
}

async function createCustomToken(uid, additionalClaims = {}) {
    const data = {
        premiumAccount: false,
        ...additionalClaims,
    };
    // idToken comes from the client app

    return await admin.auth().createCustomToken(uid, data);
}

export const FireUserHelpers = {
    createCustomToken,
    getUser,
    auth,
    getUserByEmail,
    getUserByPhoneNumber,
    updateUser,
    createUser,
    verifyIdToken,
};
