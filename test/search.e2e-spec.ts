import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { SearchModule } from '../src/search/search.module';
import { CouchDbService } from '../src/database/couchdb.service';
import { DatabaseModule } from '../src/database/database.module';

describe('SearchController (e2e)', () => {
  let app: INestApplication<App>;

  const mockDb = {
    insert: jest.fn(),
    find: jest.fn(),
  };

  const mockCouchDbService = {
    getOrCreateDatabase: jest.fn().mockResolvedValue(mockDb),
    createIndex: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SearchModule, DatabaseModule],
    })
      .overrideProvider(CouchDbService)
      .useValue(mockCouchDbService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /search/suggestions', () => {
    it('should return search suggestions', async () => {
      const mockSuggestions = [
        { _id: 'search-1', search: 'javascript basics', useCount: 10 },
        { _id: 'search-2', search: 'javascript advanced', useCount: 5 },
      ];
      mockDb.find.mockResolvedValue({ docs: mockSuggestions });

      const response = await request(app.getHttpServer())
        .get('/search/suggestions')
        .query({ q: 'javascript' })
        .expect(200);

      expect(response.body).toEqual(mockSuggestions);
    });

    it('should validate query parameter', async () => {
      await request(app.getHttpServer()).get('/search/suggestions').expect(400);
    });

    it('should accept limit parameter', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });

      await request(app.getHttpServer())
        .get('/search/suggestions')
        .query({ q: 'test', limit: 5 })
        .expect(200);

      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 5 }),
      );
    });
  });

  describe('GET /search/popular', () => {
    it('should return popular searches', async () => {
      const mockPopular = [
        { _id: 'search-1', search: 'most popular', useCount: 100 },
        { _id: 'search-2', search: 'second popular', useCount: 50 },
      ];
      mockDb.find.mockResolvedValue({ docs: mockPopular });

      const response = await request(app.getHttpServer())
        .get('/search/popular')
        .expect(200);

      expect(response.body).toEqual(mockPopular);
    });

    it('should accept limit parameter', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });

      await request(app.getHttpServer())
        .get('/search/popular')
        .query({ limit: 10 })
        .expect(200);

      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10 }),
      );
    });
  });

  describe('POST /search/track', () => {
    it('should track a new search', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });
      mockDb.insert.mockResolvedValue({ id: 'search-1', rev: '1-abc' });

      const response = await request(app.getHttpServer())
        .post('/search/track')
        .send({ search: 'new search term' })
        .expect(201);

      expect(response.body).toMatchObject({
        type: 'search_suggestion',
        search: 'new search term',
        useCount: 1,
      });
    });

    it('should validate request body', async () => {
      await request(app.getHttpServer())
        .post('/search/track')
        .send({})
        .expect(400);
    });

    it('should update existing search and increment count', async () => {
      const existingSuggestion = {
        _id: 'search-1',
        _rev: '1-abc',
        type: 'search_suggestion',
        search: 'existing search',
        searchHash: 'abc123',
        useCount: 5,
        lastUsedAt: '2024-01-01T00:00:00.000Z',
      };
      mockDb.find.mockResolvedValue({ docs: [existingSuggestion] });
      mockDb.insert.mockResolvedValue({ id: 'search-1', rev: '2-def' });

      const response = await request(app.getHttpServer())
        .post('/search/track')
        .send({ search: 'existing search' })
        .expect(201);

      expect(response.body.useCount).toBe(6);
    });
  });
});
