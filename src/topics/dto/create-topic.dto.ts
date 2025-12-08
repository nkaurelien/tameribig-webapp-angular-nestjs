import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty({ description: 'Topic name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Topic picture URL' })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiPropertyOptional({ description: 'Topic miniature/thumbnail URL' })
  @IsOptional()
  @IsString()
  miniature?: string;

  @ApiPropertyOptional({ description: 'Topic description' })
  @IsOptional()
  @IsString()
  description?: string;
}
