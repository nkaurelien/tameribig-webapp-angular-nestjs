/* tslint:disable:object-literal-key-quotes */
import mongoose from 'mongoose';

export const ImageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: false,
    },
    authorId: {
        type: String,
        // type: mongoose.SchemaTypes.ObjectId,
        required: false,
    },
    uid: String,
    picture: String,
    download: String,
    miniature: String,
    description: String,
    originalname: String,
    upvotes: {
        total: Number,
    },
    views: {
        total: Number,
    },
    price: Number,
    keywords: Array,
    topics: Array,
    comments: Array,
    size: Object,
    services: {
        type: {
            cloudinary: Object,
        },
        select: false,
    },
    srcFile: {
        type: {
            bytes: Number,
            downloadUrl: String,
            downloadSecureUrl: String,
            originalname: String,
            services: {
                cloudinary: Object,
            },
        },
        select: false,
    },
    updatedAt: String,
    publishedAt: String,
    deletedAt: String,
    createdAt: {
        type: String,
        required: true,
        default() {
            return (new Date()).toISOString();
        },
    },

    author: {
        fullname: String,
        displayName: {
            type: String,
            required: true,
        },
        uid: {
            type: String,
            required: true,
        },
        email: String,
        social: String,
        avatar: String,
    },
});

// To create an index to support text search
ImageSchema.index({'title': 'text'});
// Or if you want to include all string fields in the index, use the '$**' wildcard:
// ImageSchema.index({'$**': 'text'});
