import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CouchDbService } from '../database/couchdb.service';

describe('TopicsService', () => {
  let service: TopicsService;
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
        TopicsService,
        {
          provide: CouchDbService,
          useValue: mockCouchDbService,
        },
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
    await service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new topic', async () => {
      const createTopicDto = {
        name: 'Technology',
        description: 'Tech related topics',
      };
      const mockResponse = { id: 'topic-1', rev: '1-abc' };

      mockDb.insert.mockResolvedValue(mockResponse);

      const result = await service.create(createTopicDto);

      expect(result).toMatchObject({
        type: 'topic',
        name: 'Technology',
        description: 'Tech related topics',
        _id: mockResponse.id,
        _rev: mockResponse.rev,
      });
      expect(result.slug).toBe('technology');
      expect(result.createdAt).toBeDefined();
    });

    it('should generate correct slug from name', async () => {
      mockDb.insert.mockResolvedValue({ id: 'topic-1', rev: '1-abc' });

      const result = await service.create({
        name: 'Art & Design',
      });

      expect(result.slug).toBe('art-design');
    });

    it('should handle accented characters in slug', async () => {
      mockDb.insert.mockResolvedValue({ id: 'topic-1', rev: '1-abc' });

      const result = await service.create({
        name: 'Économie française',
      });

      expect(result.slug).toBe('economie-francaise');
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted topics', async () => {
      const mockTopics = [
        { _id: 'topic-1', name: 'Tech', type: 'topic' },
        { _id: 'topic-2', name: 'Art', type: 'topic' },
      ];
      mockDb.find.mockResolvedValue({ docs: mockTopics });

      const result = await service.findAll();

      expect(result).toEqual(mockTopics);
      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            type: 'topic',
            deletedAt: { $exists: false },
          }),
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return a topic by ID', async () => {
      const mockTopic = { _id: 'topic-1', name: 'Tech', type: 'topic' };
      mockDb.get.mockResolvedValue(mockTopic);

      const result = await service.findById('topic-1');

      expect(result).toEqual(mockTopic);
    });

    it('should throw NotFoundException when topic not found', async () => {
      mockDb.get.mockRejectedValue(new Error('not found'));

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when topic is deleted', async () => {
      mockDb.get.mockResolvedValue({
        _id: 'topic-1',
        deletedAt: new Date().toISOString(),
      });

      await expect(service.findById('topic-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findBySlug', () => {
    it('should return topic by slug', async () => {
      const mockTopic = { _id: 'topic-1', slug: 'technology' };
      mockDb.find.mockResolvedValue({ docs: [mockTopic] });

      const result = await service.findBySlug('technology');

      expect(result).toEqual(mockTopic);
    });

    it('should return null when not found', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });

      const result = await service.findBySlug('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a topic', async () => {
      const existingTopic = {
        _id: 'topic-1',
        _rev: '1-abc',
        type: 'topic',
        name: 'Tech',
        slug: 'tech',
      };
      mockDb.get.mockResolvedValue(existingTopic);
      mockDb.insert.mockResolvedValue({ id: 'topic-1', rev: '2-def' });

      const result = await service.update('topic-1', {
        name: 'Technology',
      });

      expect(result.name).toBe('Technology');
      expect(result.slug).toBe('technology');
      expect(result.updatedAt).toBeDefined();
    });

    it('should keep existing slug if name not changed', async () => {
      const existingTopic = {
        _id: 'topic-1',
        _rev: '1-abc',
        type: 'topic',
        name: 'Tech',
        slug: 'tech',
      };
      mockDb.get.mockResolvedValue(existingTopic);
      mockDb.insert.mockResolvedValue({ id: 'topic-1', rev: '2-def' });

      const result = await service.update('topic-1', {
        description: 'Updated description',
      });

      expect(result.slug).toBe('tech');
    });
  });

  describe('softDelete', () => {
    it('should soft delete a topic', async () => {
      const existingTopic = {
        _id: 'topic-1',
        _rev: '1-abc',
        type: 'topic',
        name: 'Tech',
      };
      mockDb.get.mockResolvedValue(existingTopic);
      mockDb.insert.mockResolvedValue({ id: 'topic-1', rev: '2-def' });

      const result = await service.softDelete('topic-1');

      expect(result.deletedAt).toBeDefined();
    });
  });
});
