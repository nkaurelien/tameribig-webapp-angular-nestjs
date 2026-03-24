import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { VerifySession, PublicAccess } from 'supertokens-nestjs';
import { TopicsService } from './topics.service.js';
import { CreateTopicDto } from './dto/create-topic.dto.js';
import { UpdateTopicDto } from './dto/update-topic.dto.js';
import { Topic } from './interfaces/topic.interface.js';

@ApiTags('topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new topic' })
  @ApiResponse({ status: 201, description: 'Topic created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createTopicDto: CreateTopicDto): Promise<Topic> {
    return this.topicsService.create(createTopicDto);
  }

  @Get()
  @PublicAccess()
  @ApiOperation({ summary: 'Get all topics' })
  @ApiResponse({ status: 200, description: 'List of topics' })
  async findAll(): Promise<Topic[]> {
    return this.topicsService.findAll();
  }

  @Get(':id')
  @PublicAccess()
  @ApiOperation({ summary: 'Get topic by ID or slug' })
  @ApiParam({ name: 'id', description: 'Topic ID or slug' })
  @ApiResponse({ status: 200, description: 'Topic found' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async findOne(@Param('id') id: string): Promise<Topic> {
    const topic = await this.topicsService.findBySlugOrId(id);
    if (!topic) {
      throw new NotFoundException(`Topic with ID or slug ${id} not found`);
    }
    return topic;
  }

  @Put(':id')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update topic by ID' })
  @ApiParam({ name: 'id', description: 'Topic ID' })
  @ApiResponse({ status: 200, description: 'Topic updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ): Promise<Topic> {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Delete(':id')
  @VerifySession()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete topic by ID (soft delete)' })
  @ApiParam({ name: 'id', description: 'Topic ID' })
  @ApiResponse({ status: 204, description: 'Topic deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.topicsService.softDelete(id);
  }
}
