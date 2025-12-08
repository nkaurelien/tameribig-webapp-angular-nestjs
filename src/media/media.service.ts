import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import type { DocumentScope, MangoQuery } from 'nano';
import { CouchDbService } from '../database/couchdb.service.js';
import { StorageService } from '../storage/storage.service.js';
import {
  Media,
  MediaType,
  MediaStatus,
  PublicMedia,
} from './interfaces/media.interface.js';
import { CreateMediaDto } from './dto/create-media.dto.js';
import { UpdateMediaDto } from './dto/update-media.dto.js';

const MEDIA_DB = 'media';

@Injectable()
export class MediaService implements OnModuleInit {
  private readonly logger = new Logger(MediaService.name);
  private db: DocumentScope<Media>;

  constructor(
    private readonly couchDbService: CouchDbService,
    private readonly storageService: StorageService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.db = await this.couchDbService.getOrCreateDatabase<Media>(MEDIA_DB);

    await this.couchDbService.createIndex(MEDIA_DB, {
      index: { fields: ['author.userId'] },
      name: 'author-index',
    });

    await this.couchDbService.createIndex(MEDIA_DB, {
      index: { fields: ['status'] },
      name: 'status-index',
    });

    await this.couchDbService.createIndex(MEDIA_DB, {
      index: { fields: ['mediaType'] },
      name: 'media-type-index',
    });

    await this.couchDbService.createIndex(MEDIA_DB, {
      index: { fields: ['topics'] },
      name: 'topics-index',
    });

    this.logger.log('Media database initialized');
  }

  async create(
    userId: string,
    displayName: string,
    file: Express.Multer.File,
    dto: CreateMediaDto,
  ): Promise<Media> {
    const uploadResult = await this.storageService.uploadFromMulter(
      file,
      'media',
    );

    const now = new Date().toISOString();
    const media: Media = {
      type: 'media',
      mediaType: dto.mediaType ?? MediaType.Image,
      status: MediaStatus.Draft,
      title: dto.title,
      description: dto.description,
      keywords: dto.keywords ?? [],
      topics: dto.topics ?? [],
      author: {
        userId,
        displayName,
      },
      storage: {
        key: uploadResult.key,
        bucket: uploadResult.bucket,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
      urls: {
        original: uploadResult.url,
        thumbnail: this.storageService.getImgproxyUrl(uploadResult.key, {
          width: 300,
          height: 300,
          resizing: 'fill',
        }),
        preview: this.storageService.getImgproxyUrl(uploadResult.key, {
          width: 800,
          height: 600,
          resizing: 'fit',
        }),
      },
      metrics: {
        views: 0,
        upvotes: 0,
        downloads: 0,
      },
      price: dto.price ?? 0,
      createdAt: now,
    };

    const response = await this.db.insert(media);
    return { ...media, _id: response.id, _rev: response.rev };
  }

  async findAllPublished(limit = 50): Promise<Media[]> {
    const query: MangoQuery = {
      selector: {
        type: 'media',
        status: MediaStatus.Published,
        deletedAt: { $exists: false },
      },
      limit,
    };

    const result = await this.db.find(query);
    return result.docs;
  }

  async findByAuthor(userId: string, limit = 100): Promise<Media[]> {
    const query: MangoQuery = {
      selector: {
        type: 'media',
        'author.userId': userId,
        deletedAt: { $exists: false },
      },
      limit,
    };

    const result = await this.db.find(query);
    return result.docs;
  }

  async findByTopic(topicId: string, limit = 50): Promise<Media[]> {
    const query: MangoQuery = {
      selector: {
        type: 'media',
        status: MediaStatus.Published,
        topics: { $elemMatch: { $eq: topicId } },
        deletedAt: { $exists: false },
      },
      limit,
    };

    const result = await this.db.find(query);
    return result.docs;
  }

  async findById(id: string): Promise<Media> {
    try {
      const media = await this.db.get(id);
      if (media.deletedAt) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }
      return media;
    } catch {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateMediaDto,
  ): Promise<Media> {
    const media = await this.findById(id);

    if (media.author.userId !== userId) {
      throw new ForbiddenException('You can only update your own media');
    }

    const updated: Media = {
      ...media,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    const response = await this.db.insert(updated);
    return { ...updated, _rev: response.rev };
  }

  async publish(id: string, userId: string): Promise<Media> {
    const media = await this.findById(id);

    if (media.author.userId !== userId) {
      throw new ForbiddenException('You can only publish your own media');
    }

    const now = new Date().toISOString();
    const updated: Media = {
      ...media,
      status: MediaStatus.Published,
      publishedAt: now,
      updatedAt: now,
    };

    const response = await this.db.insert(updated);
    return { ...updated, _rev: response.rev };
  }

  async unpublish(id: string, userId: string): Promise<Media> {
    const media = await this.findById(id);

    if (media.author.userId !== userId) {
      throw new ForbiddenException('You can only unpublish your own media');
    }

    const updated: Media = {
      ...media,
      status: MediaStatus.Draft,
      updatedAt: new Date().toISOString(),
    };

    const response = await this.db.insert(updated);
    return { ...updated, _rev: response.rev };
  }

  async delete(id: string, userId: string): Promise<void> {
    const media = await this.findById(id);

    if (media.author.userId !== userId) {
      throw new ForbiddenException('You can only delete your own media');
    }

    await this.storageService.delete(media.storage.key);

    if (media._rev) {
      await this.db.destroy(id, media._rev);
    }
  }

  async softDelete(id: string, userId: string): Promise<Media> {
    const media = await this.findById(id);

    if (media.author.userId !== userId) {
      throw new ForbiddenException('You can only delete your own media');
    }

    const updated: Media = {
      ...media,
      status: MediaStatus.Archived,
      deletedAt: new Date().toISOString(),
    };

    const response = await this.db.insert(updated);
    return { ...updated, _rev: response.rev };
  }

  async incrementViews(id: string): Promise<void> {
    const media = await this.findById(id);
    const updated: Media = {
      ...media,
      metrics: {
        ...media.metrics,
        views: (media.metrics.views || 0) + 1,
      },
    };
    await this.db.insert(updated);
  }

  async incrementUpvotes(id: string): Promise<void> {
    const media = await this.findById(id);
    const updated: Media = {
      ...media,
      metrics: {
        ...media.metrics,
        upvotes: (media.metrics.upvotes || 0) + 1,
      },
    };
    await this.db.insert(updated);
  }

  async getDownloadUrl(id: string): Promise<string> {
    const media = await this.findById(id);

    const updated: Media = {
      ...media,
      metrics: {
        ...media.metrics,
        downloads: (media.metrics.downloads || 0) + 1,
      },
    };
    await this.db.insert(updated);

    return this.storageService.getSignedDownloadUrl(media.storage.key);
  }

  toPublicMedia(media: Media): PublicMedia {
    return {
      _id: media._id,
      title: media.title,
      description: media.description,
      mediaType: media.mediaType,
      keywords: media.keywords,
      topics: media.topics,
      author: media.author,
      urls: {
        thumbnail: media.urls.thumbnail,
        preview: media.urls.preview,
      },
      dimensions: media.dimensions,
      metrics: media.metrics,
      price: media.price,
      createdAt: media.createdAt,
    };
  }
}
