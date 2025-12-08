import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { MediaService } from './media.service';
import { CouchDbService } from '../database/couchdb.service';
import { StorageService } from '../storage/storage.service';
import { MediaType, MediaStatus } from './interfaces/media.interface';

describe('MediaService', () => {
  let service: MediaService;
  let mockDb: {
    insert: jest.Mock;
    get: jest.Mock;
    find: jest.Mock;
    destroy: jest.Mock;
  };

  const mockCouchDbService = {
    getOrCreateDatabase: jest.fn(),
    createIndex: jest.fn(),
  };

  const mockStorageService = {
    uploadFromMulter: jest.fn(),
    getImgproxyUrl: jest.fn(),
    getSignedDownloadUrl: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    mockDb = {
      insert: jest.fn(),
      get: jest.fn(),
      find: jest.fn(),
      destroy: jest.fn(),
    };

    mockCouchDbService.getOrCreateDatabase.mockResolvedValue(mockDb);
    mockCouchDbService.createIndex.mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: CouchDbService,
          useValue: mockCouchDbService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
    await service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new media', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const uploadResult = {
        key: 'media/123-abc.jpg',
        bucket: 'tameri-bucket',
        url: 'http://localhost:9000/tameri-bucket/media/123-abc.jpg',
        size: 1024,
        contentType: 'image/jpeg',
      };

      mockStorageService.uploadFromMulter.mockResolvedValue(uploadResult);
      mockStorageService.getImgproxyUrl.mockReturnValue(
        'http://localhost:8080/thumbnail.webp',
      );
      mockDb.insert.mockResolvedValue({ id: 'media-1', rev: '1-abc' });

      const result = await service.create('user-1', 'Test User', mockFile, {
        title: 'Test Image',
        description: 'A test image',
      });

      expect(result).toMatchObject({
        type: 'media',
        title: 'Test Image',
        mediaType: MediaType.Image,
        status: MediaStatus.Draft,
        author: { userId: 'user-1', displayName: 'Test User' },
      });
      expect(result.storage.key).toBe('media/123-abc.jpg');
      expect(result.urls.original).toBeDefined();
      expect(result.urls.thumbnail).toBeDefined();
    });
  });

  describe('findAllPublished', () => {
    it('should return only published media', async () => {
      const mockMedia = [
        { _id: 'media-1', status: MediaStatus.Published },
        { _id: 'media-2', status: MediaStatus.Published },
      ];
      mockDb.find.mockResolvedValue({ docs: mockMedia });

      const result = await service.findAllPublished();

      expect(result).toEqual(mockMedia);
      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            status: MediaStatus.Published,
          }),
        }),
      );
    });
  });

  describe('findByAuthor', () => {
    it('should return media by author', async () => {
      const mockMedia = [{ _id: 'media-1', author: { userId: 'user-1' } }];
      mockDb.find.mockResolvedValue({ docs: mockMedia });

      const result = await service.findByAuthor('user-1');

      expect(result).toEqual(mockMedia);
    });
  });

  describe('findById', () => {
    it('should return media by ID', async () => {
      const mockMedia = { _id: 'media-1', title: 'Test' };
      mockDb.get.mockResolvedValue(mockMedia);

      const result = await service.findById('media-1');

      expect(result).toEqual(mockMedia);
    });

    it('should throw NotFoundException when not found', async () => {
      mockDb.get.mockRejectedValue(new Error('not found'));

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when deleted', async () => {
      mockDb.get.mockResolvedValue({
        _id: 'media-1',
        deletedAt: new Date().toISOString(),
      });

      await expect(service.findById('media-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update media owned by user', async () => {
      const existingMedia = {
        _id: 'media-1',
        _rev: '1-abc',
        type: 'media',
        title: 'Old Title',
        author: { userId: 'user-1' },
      };
      mockDb.get.mockResolvedValue(existingMedia);
      mockDb.insert.mockResolvedValue({ id: 'media-1', rev: '2-def' });

      const result = await service.update('media-1', 'user-1', {
        title: 'New Title',
      });

      expect(result.title).toBe('New Title');
    });

    it('should throw ForbiddenException for non-owner', async () => {
      const existingMedia = {
        _id: 'media-1',
        author: { userId: 'user-1' },
      };
      mockDb.get.mockResolvedValue(existingMedia);

      await expect(
        service.update('media-1', 'user-2', { title: 'New' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('publish', () => {
    it('should publish media', async () => {
      const existingMedia = {
        _id: 'media-1',
        _rev: '1-abc',
        type: 'media',
        status: MediaStatus.Draft,
        author: { userId: 'user-1' },
      };
      mockDb.get.mockResolvedValue(existingMedia);
      mockDb.insert.mockResolvedValue({ id: 'media-1', rev: '2-def' });

      const result = await service.publish('media-1', 'user-1');

      expect(result.status).toBe(MediaStatus.Published);
      expect(result.publishedAt).toBeDefined();
    });
  });

  describe('unpublish', () => {
    it('should unpublish media', async () => {
      const existingMedia = {
        _id: 'media-1',
        _rev: '1-abc',
        type: 'media',
        status: MediaStatus.Published,
        author: { userId: 'user-1' },
      };
      mockDb.get.mockResolvedValue(existingMedia);
      mockDb.insert.mockResolvedValue({ id: 'media-1', rev: '2-def' });

      const result = await service.unpublish('media-1', 'user-1');

      expect(result.status).toBe(MediaStatus.Draft);
    });
  });

  describe('incrementViews', () => {
    it('should increment view count', async () => {
      const existingMedia = {
        _id: 'media-1',
        _rev: '1-abc',
        metrics: { views: 10, upvotes: 5, downloads: 2 },
      };
      mockDb.get.mockResolvedValue(existingMedia);
      mockDb.insert.mockResolvedValue({ ok: true });

      await service.incrementViews('media-1');

      expect(mockDb.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.objectContaining({ views: 11 }),
        }),
      );
    });
  });

  describe('getDownloadUrl', () => {
    it('should return signed URL and increment downloads', async () => {
      const existingMedia = {
        _id: 'media-1',
        _rev: '1-abc',
        storage: { key: 'media/test.jpg' },
        metrics: { views: 10, upvotes: 5, downloads: 2 },
      };
      mockDb.get.mockResolvedValue(existingMedia);
      mockDb.insert.mockResolvedValue({ ok: true });
      mockStorageService.getSignedDownloadUrl.mockResolvedValue(
        'https://signed-url.example.com',
      );

      const result = await service.getDownloadUrl('media-1');

      expect(result).toBe('https://signed-url.example.com');
      expect(mockDb.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.objectContaining({ downloads: 3 }),
        }),
      );
    });
  });

  describe('toPublicMedia', () => {
    it('should return only public fields', () => {
      const media = {
        _id: 'media-1',
        _rev: '1-abc',
        type: 'media' as const,
        mediaType: MediaType.Image,
        status: MediaStatus.Published,
        title: 'Test',
        description: 'Description',
        keywords: ['test'],
        topics: ['topic-1'],
        author: { userId: 'user-1', displayName: 'Test User' },
        storage: {
          key: 'secret-key',
          bucket: 'bucket',
          originalName: 'test.jpg',
          mimeType: 'image/jpeg',
          size: 1024,
        },
        urls: {
          original: 'http://original',
          thumbnail: 'http://thumb',
          preview: 'http://preview',
        },
        metrics: { views: 10, upvotes: 5, downloads: 2 },
        price: 0,
        createdAt: new Date().toISOString(),
      };

      const result = service.toPublicMedia(media);

      expect(result._id).toBe('media-1');
      expect(result.urls.thumbnail).toBeDefined();
      expect(result.urls.preview).toBeDefined();
      expect(result).not.toHaveProperty('storage');
      expect((result.urls as Record<string, unknown>).original).toBeUndefined();
    });
  });
});
