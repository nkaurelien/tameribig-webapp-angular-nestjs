import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import type { DocumentScope, MangoQuery } from 'nano';
import { CouchDbService } from '../database/couchdb.service.js';
import {
  SearchSuggestion,
  SearchSuggestionType,
} from './interfaces/search-suggestion.interface.js';
import { CreateSearchSuggestionDto } from './dto/create-search-suggestion.dto.js';

const SEARCH_DB = 'search_suggestions';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private db: DocumentScope<SearchSuggestion>;

  constructor(private readonly couchDbService: CouchDbService) {}

  async onModuleInit(): Promise<void> {
    this.db =
      await this.couchDbService.getOrCreateDatabase<SearchSuggestion>(
        SEARCH_DB,
      );

    await this.couchDbService.createIndex(SEARCH_DB, {
      index: { fields: ['search'] },
      name: 'search-index',
    });

    await this.couchDbService.createIndex(SEARCH_DB, {
      index: { fields: ['searchHash'] },
      name: 'search-hash-index',
    });

    await this.couchDbService.createIndex(SEARCH_DB, {
      index: { fields: ['useCount'] },
      name: 'use-count-index',
    });

    this.logger.log('Search suggestions database initialized');
  }

  async createOrUpdateSuggestion(
    dto: CreateSearchSuggestionDto,
  ): Promise<SearchSuggestion> {
    const searchHash = this.hashSearch(dto.search);
    const existing = await this.findByHash(searchHash);

    if (existing) {
      const updated: SearchSuggestion = {
        ...existing,
        useCount: (existing.useCount || 0) + 1,
        lastUsedAt: new Date().toISOString(),
      };
      const response = await this.db.insert(updated);
      return { ...updated, _rev: response.rev };
    }

    const now = new Date().toISOString();
    const suggestion: SearchSuggestion = {
      type: 'search_suggestion',
      search: dto.search.toLowerCase().trim(),
      searchType: dto.searchType ?? SearchSuggestionType.Text,
      searchHash,
      useCount: 1,
      lastUsedAt: now,
      createdAt: now,
    };

    const response = await this.db.insert(suggestion);
    return { ...suggestion, _id: response.id, _rev: response.rev };
  }

  async findByHash(hash: string): Promise<SearchSuggestion | null> {
    const query: MangoQuery = {
      selector: { type: 'search_suggestion', searchHash: hash },
      limit: 1,
    };

    const result = await this.db.find(query);
    return result.docs[0] ?? null;
  }

  async findSuggestions(
    searchText: string,
    limit = 10,
  ): Promise<SearchSuggestion[]> {
    const normalized = searchText.toLowerCase().trim();

    const query: MangoQuery = {
      selector: {
        type: 'search_suggestion',
        search: { $regex: `^${this.escapeRegex(normalized)}` },
      },
      sort: [{ useCount: 'desc' as const }],
      limit,
    };

    const result = await this.db.find(query);
    return result.docs;
  }

  async getPopularSuggestions(limit = 20): Promise<SearchSuggestion[]> {
    const query: MangoQuery = {
      selector: { type: 'search_suggestion' },
      sort: [{ useCount: 'desc' as const }],
      limit,
    };

    const result = await this.db.find(query);
    return result.docs;
  }

  private hashSearch(search: string): string {
    return createHash('md5').update(search.toLowerCase().trim()).digest('hex');
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
