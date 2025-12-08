import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { CouchDbService } from '../database/couchdb.service';
import { SearchSuggestionType } from './interfaces/search-suggestion.interface';

describe('SearchService', () => {
  let service: SearchService;
  let mockDb: {
    insert: jest.Mock;
    find: jest.Mock;
  };

  const mockCouchDbService = {
    getOrCreateDatabase: jest.fn(),
    createIndex: jest.fn(),
  };

  beforeEach(async () => {
    mockDb = {
      insert: jest.fn(),
      find: jest.fn(),
    };

    mockCouchDbService.getOrCreateDatabase.mockResolvedValue(mockDb);
    mockCouchDbService.createIndex.mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: CouchDbService,
          useValue: mockCouchDbService,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    await service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrUpdateSuggestion', () => {
    it('should create a new suggestion', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });
      mockDb.insert.mockResolvedValue({ id: 'search-1', rev: '1-abc' });

      const result = await service.createOrUpdateSuggestion({
        search: 'JavaScript tutorials',
      });

      expect(result).toMatchObject({
        type: 'search_suggestion',
        search: 'javascript tutorials',
        searchType: SearchSuggestionType.Text,
        useCount: 1,
      });
      expect(result.searchHash).toBeDefined();
    });

    it('should update existing suggestion and increment useCount', async () => {
      const existingSuggestion = {
        _id: 'search-1',
        _rev: '1-abc',
        type: 'search_suggestion',
        search: 'javascript tutorials',
        searchHash: 'abc123',
        useCount: 5,
        lastUsedAt: '2024-01-01T00:00:00.000Z',
      };

      mockDb.find.mockResolvedValue({ docs: [existingSuggestion] });
      mockDb.insert.mockResolvedValue({ id: 'search-1', rev: '2-def' });

      const result = await service.createOrUpdateSuggestion({
        search: 'JavaScript tutorials',
      });

      expect(result.useCount).toBe(6);
      expect(result._rev).toBe('2-def');
    });

    it('should normalize search text', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });
      mockDb.insert.mockResolvedValue({ id: 'search-1', rev: '1-abc' });

      const result = await service.createOrUpdateSuggestion({
        search: '  UPPERCASE with SPACES  ',
      });

      expect(result.search).toBe('uppercase with spaces');
    });
  });

  describe('findSuggestions', () => {
    it('should return matching suggestions', async () => {
      const mockSuggestions = [
        { _id: 'search-1', search: 'javascript basics' },
        { _id: 'search-2', search: 'javascript advanced' },
      ];
      mockDb.find.mockResolvedValue({ docs: mockSuggestions });

      const result = await service.findSuggestions('javascript');

      expect(result).toEqual(mockSuggestions);
    });

    it('should escape regex special characters', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });

      await service.findSuggestions('c++');

      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            search: { $regex: '^c\\+\\+' },
          }),
        }),
      );
    });
  });

  describe('getPopularSuggestions', () => {
    it('should return suggestions sorted by useCount', async () => {
      const mockSuggestions = [
        { _id: 'search-1', search: 'popular', useCount: 100 },
        { _id: 'search-2', search: 'less popular', useCount: 50 },
      ];
      mockDb.find.mockResolvedValue({ docs: mockSuggestions });

      const result = await service.getPopularSuggestions();

      expect(result).toEqual(mockSuggestions);
      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          sort: [{ useCount: 'desc' }],
        }),
      );
    });

    it('should respect limit parameter', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });

      await service.getPopularSuggestions(5);

      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 5,
        }),
      );
    });
  });
});
