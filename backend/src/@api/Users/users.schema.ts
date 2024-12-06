import mongoose from 'mongoose';
// import * as bcrypt from 'bcrypt';
import {PartialDelete} from '@core/entities/delete.partial.schema';
import {validateHash} from '@core/utils';

export const UserSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        uid: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        emailAuthHash: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            select: false,
        },
        phoneNumber: String,
        displayName: String,
        firstName: String,
        lastName: String,
        photoUrl: String,
        occupation: String,
        companyName: String,
        upvotes: Object,
        views: Object,
        address: Object,
        socialLinks: Object,
        about: String,
        roles: Array,
        permissions: Array,
        updatedAt: String,
        deletedAt: String,
        createdAt: {
            type: String,
            required: false,
        },

        ...PartialDelete,
    },
    {timestamps: true},
);

// tslint:disable-next-line:object-literal-key-quotes
UserSchema.index({'fullname': 'text'});

UserSchema.methods.comparePassword = comparePassword;

/**
 * Helper method for validating user's password.
 * @param {string} candidatePassword
 */
function comparePassword(candidatePassword: string): Promise<boolean> {
    return validateHash(candidatePassword, this.password).catch(() => {
        throw {err: 'Error validating password'};
    });
}
