// Use for mongo DB
export const IMAGE_MODEL_PROVIDER = 'images-from-mongodb';

// Use for Firebase
export const IMAGE_COLLECTION_PROVIDER = 'images-from-firebase';

export const IMAGE_COLLECTION_INDEX = 'images';

const idRegex = '([0-9a-f]{24})';
export const ImageRoutesToken = {
    root: 'images',
    singleItem: ':id([0-9a-f]{24})',
    singleItemComments: ':id([0-9a-f]{24})/comments',
    singleItemKeywords: ':id([0-9a-f]{24})/keywords',
    singleItemViewsUp: ':id([0-9a-f]{24})/views-up',
    singleItemVoteUp: ':id([0-9a-f]{24})/vote-up',
    singleItemVoteDown: ':id([0-9a-f]{24})/vote-down',
    singleItemPublish: ':id([0-9a-f]{24})/publish',
    singleItemUnpublish: ':id([0-9a-f]{24})/unpublish',
    singleItemUpload: 'upload-picture',
    singleItemUploadArchivedSourceFile: 'upload-archive',

    // download urls
    singleItemDownloadImage: ':id([0-9a-f]{24})/download-picture',
    singleItemDownloadImageArchive: ':id([0-9a-f]{24})/download-picture-archive',
};
