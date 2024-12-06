import mongoose from 'mongoose';

export const TopicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    uid: String,
    picture: String,
    miniature: String,
    description: String,
    updatedAt: String,
    deletedAt: String,
    createdAt: {
        type: String,
        required: false,
    },
});
