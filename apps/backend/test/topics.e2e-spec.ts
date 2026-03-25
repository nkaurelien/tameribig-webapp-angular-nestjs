import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { TopicsModule } from '../src/topics/topics.module';
import { TopicsService } from '../src/topics/topics.service';
import { CouchDbService } from '../src/database/couchdb.service';
import { DatabaseModule } from '../src/database/database.module';

describe('TopicsController (e2e)', () => {
  let app: INestApplication<App>;
  let topicsService: TopicsService; // eslint-disable-line @typescript-eslint/no-unused-vars

  const mockDb = {
    insert: jest.fn(),
    get: jest.fn(),
    find: jest.fn(),
    destroy: jest.fn(),
  };

  const mockCouchDbService = {
    getOrCreateDatabase: jest.fn().mockResolvedValue(mockDb),
    createIndex: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TopicsModule, DatabaseModule],
    })
      .overrideProvider(CouchDbService)
      .useValue(mockCouchDbService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    topicsService = moduleFixture.get<TopicsService>(TopicsService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /topics', () => {
    it('should return all topics', async () => {
      const mockTopics = [
        { _id: 'topic-1', name: 'Technology', slug: 'technology' },
        { _id: 'topic-2', name: 'Art', slug: 'art' },
      ];
      mockDb.find.mockResolvedValue({ docs: mockTopics });

      const response = await request(app.getHttpServer())
        .get('/topics')
        .expect(200);

      expect(response.body).toEqual(mockTopics);
    });
  });

  describe('GET /topics/:id', () => {
    it('should return a topic by ID', async () => {
      const mockTopic = {
        _id: 'topic-1',
        name: 'Technology',
        slug: 'technology',
      };
      mockDb.find.mockResolvedValue({ docs: [] }); // For slug search
      mockDb.get.mockResolvedValue(mockTopic);

      const response = await request(app.getHttpServer())
        .get('/topics/topic-1')
        .expect(200);

      expect(response.body).toMatchObject({ name: 'Technology' });
    });

    it('should return a topic by slug', async () => {
      const mockTopic = {
        _id: 'topic-1',
        name: 'Technology',
        slug: 'technology',
      };
      mockDb.find.mockResolvedValue({ docs: [mockTopic] });

      const response = await request(app.getHttpServer())
        .get('/topics/technology')
        .expect(200);

      expect(response.body).toMatchObject({ slug: 'technology' });
    });

    it('should return 404 when topic not found', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });
      mockDb.get.mockRejectedValue(new Error('not found'));

      await request(app.getHttpServer())
        .get('/topics/non-existent')
        .expect(404);
    });
  });

  // Note: POST, PUT, DELETE require authentication
  // These would need to mock SuperTokens or use test auth
});
