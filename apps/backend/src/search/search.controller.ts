import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PublicAccess } from 'supertokens-nestjs';
import { SearchService } from './search.service.js';
import { CreateSearchSuggestionDto } from './dto/create-search-suggestion.dto.js';
import { SearchQueryDto } from './dto/search-query.dto.js';
import { SearchSuggestion } from './interfaces/search-suggestion.interface.js';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('suggestions')
  @PublicAccess()
  @ApiOperation({ summary: 'Get search suggestions based on query' })
  @ApiQuery({ name: 'q', description: 'Search query text' })
  @ApiQuery({ name: 'limit', required: false, description: 'Max results' })
  @ApiResponse({ status: 200, description: 'List of suggestions' })
  async getSuggestions(
    @Query() query: SearchQueryDto,
  ): Promise<SearchSuggestion[]> {
    return this.searchService.findSuggestions(query.q, query.limit ?? 10);
  }

  @Get('popular')
  @PublicAccess()
  @ApiOperation({ summary: 'Get popular search terms' })
  @ApiQuery({ name: 'limit', required: false, description: 'Max results' })
  @ApiResponse({ status: 200, description: 'List of popular searches' })
  async getPopular(
    @Query('limit') limit?: number,
  ): Promise<SearchSuggestion[]> {
    return this.searchService.getPopularSuggestions(limit ?? 20);
  }

  @Post('track')
  @PublicAccess()
  @ApiOperation({ summary: 'Track a search query for suggestions' })
  @ApiResponse({ status: 201, description: 'Search tracked successfully' })
  async trackSearch(
    @Body() dto: CreateSearchSuggestionDto,
  ): Promise<SearchSuggestion> {
    return this.searchService.createOrUpdateSuggestion(dto);
  }
}
