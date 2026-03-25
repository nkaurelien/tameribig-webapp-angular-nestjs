import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaType } from '../interfaces/media.interface.js';

export class CreateMediaDto {
  @ApiProperty({ description: 'Media title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Media description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Media type',
    enum: MediaType,
    default: MediaType.Image,
  })
  @IsOptional()
  @IsEnum(MediaType)
  mediaType?: MediaType;

  @ApiPropertyOptional({ description: 'Keywords for search', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Topic IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics?: string[];

  @ApiPropertyOptional({ description: 'Price (0 for free)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;
}
