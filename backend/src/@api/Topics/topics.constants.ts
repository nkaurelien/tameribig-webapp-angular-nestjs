// Use for mongo DB
export const IMAGE_MODEL_PROVIDER = 'images-from-mongodb';

// Use for Firebase
export const TOPICS_COLLECTION_PROVIDER = 'topics-from-firebase';

export const TOPICS_COLLECTION_INDEX = 'topics';

// const idRegex = '([0-9a-f]{24})';
export const TopicRoutesToken = {
    root: 'topics',
    singleItem: ':id([0-9a-f]{24})',
};
