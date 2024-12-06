import {Document} from 'mongoose';
import {AssetUploadResponse} from '@core/classes/Cloudinary/AssetUploadResponse';
import {get as _get} from 'lodash';

export interface Image extends Document {
    readonly title: string;
    readonly content: string;
    readonly userId: string;
    readonly uid: string;
    readonly fileName: string;
    readonly picture: string;
    readonly download: string;
    readonly miniature: string;
    readonly description: string;
    readonly  originalname?: string;
    readonly encoding?: string;
    readonly mimetype?: string;
    readonly services: {
        cloudinary: AssetUploadResponse,
    };
    readonly srcFile: ImageSourceFile;
    readonly price: number;
    readonly authorId: Author;
    readonly author: Author;
    readonly createdAt: string;
    readonly updatedAt?: string;
    readonly deletedAt?: string;
    readonly upvotes?: {
        total?: number;
    };
    readonly views?: {
        total?: number;
    };
    readonly comments?: ImageComment[];

    readonly keywords: string[];
    readonly topics: string[];

    readonly size?: {
        xs?: ImageSize;
        sm?: ImageSize;
        md?: ImageSize;
        lg?: ImageSize;
        xl?: ImageSize;
    };
}

export interface Author {
    fullname: string;
    displayName: string;
    uid?: string;
    email?: string;
    social?: string;
    avatar?: string;
}

export interface ImageSize {
    size?: string;
    downloadUrl: string;
}

export interface ImageComment {
    createdAt?: string;
    author?: string;
    content: string;
}

export interface ImageSourceFile {
    bytes?: number;
    originalname?: string;
    downloadUrl: string;
    downloadSecureUrl?: string;
    services?: {
        cloudinary: AssetUploadResponse,
    };
}

export function image_presenter(image: Partial<Image>): any {

    const {srcFile, services} = image;
    const breakpoints = _get(services, 'cloudinary.responsive_breakpoints.0.breakpoints'.split('.')) || [];
    const srcFileBytes = _get(services, 'srcFile.bytes'.split('.')) || undefined;
    return {
        ...image,
        srcFile: undefined,
        services: undefined,
        sizes: undefined,
        srcFileBytes,
        breakpoints,
    };
}
