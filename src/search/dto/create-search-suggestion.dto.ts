import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SearchSuggestionType } from '../interfaces/search-suggestion.interface.js';

export class CreateSearchSuggestionDto {
  @ApiProperty({ description: 'Search query text' })
  @IsString()
  search: string;

  @ApiPropertyOptional({
    description: 'Type of search',
    enum: SearchSuggestionType,
    default: SearchSuggestionType.Text,
  })
  @IsOptional()
  @IsEnum(SearchSuggestionType)
  searchType?: SearchSuggestionType;
}
