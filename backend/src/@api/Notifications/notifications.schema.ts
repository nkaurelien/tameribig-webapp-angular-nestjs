import mongoose from 'mongoose';

export const NotificationsSchema = new mongoose.Schema(
    {

        uid: {
            type: String,
            required: true,
        },

        notifiableId: {
            type: String,
            required: true,
        },
        notifiableType: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        data: {
            type: Object,
            required: true,
        },
        readAt: String,
        createdAt: {
            type: String,
            required: false,
        },

    },
    {timestamps: true},
);
