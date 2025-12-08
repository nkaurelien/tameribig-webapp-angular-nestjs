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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import type { SessionContainer } from 'supertokens-node/recipe/session';
import { VerifySession, Session } from 'supertokens-nestjs';
import { NotificationsService } from './notifications.service.js';
import { CreateNotificationDto } from './dto/create-notification.dto.js';
import { Notification } from './interfaces/notification.interface.js';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'Notification created' })
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get('me')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user notifications' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of notifications' })
  async getMyNotifications(
    @Session() session: SessionContainer,
    @Query('limit') limit?: string,
  ): Promise<Notification[]> {
    const userId = session.getUserId();
    return this.notificationsService.findByNotifiableId(
      userId,
      'User',
      limit ? parseInt(limit, 10) : 100,
    );
  }

  @Get('me/unread')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user unread notifications' })
  @ApiResponse({ status: 200, description: 'List of unread notifications' })
  async getMyUnreadNotifications(
    @Session() session: SessionContainer,
  ): Promise<Notification[]> {
    const userId = session.getUserId();
    return this.notificationsService.findUnreadByNotifiableId(userId, 'User');
  }

  @Get('me/count')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread notifications count' })
  @ApiResponse({ status: 200, description: 'Unread count' })
  async getUnreadCount(
    @Session() session: SessionContainer,
  ): Promise<{ count: number }> {
    const userId = session.getUserId();
    const count = await this.notificationsService.countUnread(userId, 'User');
    return { count };
  }

  @Put('me/read-all')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'Notifications marked as read' })
  async markAllAsRead(
    @Session() session: SessionContainer,
  ): Promise<{ marked: number }> {
    const userId = session.getUserId();
    const marked = await this.notificationsService.markAllAsRead(
      userId,
      'User',
    );
    return { marked };
  }

  @Get(':id')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification found' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.findById(id);
  }

  @Put(':id/read')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  @Delete(':id')
  @VerifySession()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete notification' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: 204, description: 'Notification deleted' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.notificationsService.remove(id);
  }
}
