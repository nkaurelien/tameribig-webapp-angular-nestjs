import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import type { SessionContainer } from 'supertokens-node/recipe/session';
import { VerifySession, Session, PublicAccess } from 'supertokens-nestjs';
import { MediaService } from './media.service.js';
import { CreateMediaDto } from './dto/create-media.dto.js';
import { UpdateMediaDto } from './dto/update-media.dto.js';
import { Media, PublicMedia } from './interfaces/media.interface.js';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @VerifySession()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a new media file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        description: { type: 'string' },
        keywords: { type: 'array', items: { type: 'string' } },
        topics: { type: 'array', items: { type: 'string' } },
        price: { type: 'number' },
      },
      required: ['file', 'title'],
    },
  })
  @ApiResponse({ status: 201, description: 'Media uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async upload(
    @Session() session: SessionContainer,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /(image|video|audio)\/(jpeg|png|gif|webp|mp4|mp3|wav)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() dto: CreateMediaDto,
  ): Promise<Media> {
    const userId = session.getUserId();
    const payload = session.getAccessTokenPayload() as Record<string, unknown>;
    const displayName = (payload['displayName'] as string) || 'Anonymous';

    return this.mediaService.create(userId, displayName, file, dto);
  }

  @Get()
  @PublicAccess()
  @ApiOperation({ summary: 'Get all published media' })
  @ApiQuery({ name: 'limit', required: false, description: 'Max results' })
  @ApiResponse({ status: 200, description: 'List of published media' })
  async findAll(@Query('limit') limit?: number): Promise<PublicMedia[]> {
    const media = await this.mediaService.findAllPublished(limit ?? 50);
    return media.map((m) => this.mediaService.toPublicMedia(m));
  }

  @Get('me')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user media' })
  @ApiResponse({ status: 200, description: 'List of user media' })
  async findMyMedia(@Session() session: SessionContainer): Promise<Media[]> {
    const userId = session.getUserId();
    return this.mediaService.findByAuthor(userId);
  }

  @Get('topic/:topicId')
  @PublicAccess()
  @ApiOperation({ summary: 'Get media by topic' })
  @ApiParam({ name: 'topicId', description: 'Topic ID' })
  @ApiResponse({ status: 200, description: 'List of media in topic' })
  async findByTopic(
    @Param('topicId') topicId: string,
    @Query('limit') limit?: number,
  ): Promise<PublicMedia[]> {
    const media = await this.mediaService.findByTopic(topicId, limit ?? 50);
    return media.map((m) => this.mediaService.toPublicMedia(m));
  }

  @Get(':id')
  @PublicAccess()
  @ApiOperation({ summary: 'Get media by ID' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Media found' })
  @ApiResponse({ status: 404, description: 'Media not found' })
  async findOne(@Param('id') id: string): Promise<PublicMedia> {
    const media = await this.mediaService.findById(id);
    await this.mediaService.incrementViews(id);
    return this.mediaService.toPublicMedia(media);
  }

  @Put(':id')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update media by ID' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Media updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Media not found' })
  async update(
    @Session() session: SessionContainer,
    @Param('id') id: string,
    @Body() dto: UpdateMediaDto,
  ): Promise<Media> {
    const userId = session.getUserId();
    return this.mediaService.update(id, userId, dto);
  }

  @Put(':id/publish')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Media published' })
  async publish(
    @Session() session: SessionContainer,
    @Param('id') id: string,
  ): Promise<Media> {
    const userId = session.getUserId();
    return this.mediaService.publish(id, userId);
  }

  @Put(':id/unpublish')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Media unpublished' })
  async unpublish(
    @Session() session: SessionContainer,
    @Param('id') id: string,
  ): Promise<Media> {
    const userId = session.getUserId();
    return this.mediaService.unpublish(id, userId);
  }

  @Post(':id/upvote')
  @VerifySession()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upvote media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Upvote recorded' })
  async upvote(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.mediaService.incrementUpvotes(id);
    return { success: true };
  }

  @Get(':id/download')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get download URL for media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, description: 'Download URL' })
  async getDownloadUrl(@Param('id') id: string): Promise<{ url: string }> {
    const url = await this.mediaService.getDownloadUrl(id);
    return { url };
  }

  @Delete(':id')
  @VerifySession()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete media (soft delete)' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 204, description: 'Media deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(
    @Session() session: SessionContainer,
    @Param('id') id: string,
  ): Promise<void> {
    const userId = session.getUserId();
    await this.mediaService.softDelete(id, userId);
  }
}
