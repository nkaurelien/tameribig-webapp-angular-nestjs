import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import type { DocumentScope, MangoQuery } from 'nano';
import { CouchDbService } from '../database/couchdb.service.js';
import { Notification } from './interfaces/notification.interface.js';
import { CreateNotificationDto } from './dto/create-notification.dto.js';

const NOTIFICATIONS_DB = 'notifications';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private db: DocumentScope<Notification>;

  constructor(private readonly couchDbService: CouchDbService) {}

  async onModuleInit(): Promise<void> {
    this.db =
      await this.couchDbService.getOrCreateDatabase<Notification>(
        NOTIFICATIONS_DB,
      );

    await this.couchDbService.createIndex(NOTIFICATIONS_DB, {
      index: { fields: ['notifiableId'] },
      name: 'notifiable-id-index',
    });

    await this.couchDbService.createIndex(NOTIFICATIONS_DB, {
      index: { fields: ['notifiableId', 'readAt'] },
      name: 'notifiable-unread-index',
    });

    this.logger.log('Notifications database initialized');
  }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const now = new Date().toISOString();

    const notification: Notification = {
      type: 'notification',
      notifiableId: createNotificationDto.notifiableId,
      notifiableType: createNotificationDto.notifiableType,
      notificationType: createNotificationDto.notificationType,
      data: (createNotificationDto.data as Notification['data']) ?? {},
      createdAt: now,
    };

    const response = await this.db.insert(notification);
    return { ...notification, _id: response.id, _rev: response.rev };
  }

  async findAll(limit = 100): Promise<Notification[]> {
    const query: MangoQuery = {
      selector: { type: 'notification' },
      sort: [{ createdAt: 'desc' as const }],
      limit,
    };

    const result = await this.db.find(query);
    return result.docs;
  }

  async findById(id: string): Promise<Notification> {
    try {
      return await this.db.get(id);
    } catch {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }

  async findByNotifiableId(
    notifiableId: string,
    notifiableType = 'User',
    limit = 100,
  ): Promise<Notification[]> {
    const query: MangoQuery = {
      selector: {
        type: 'notification',
        notifiableId,
        notifiableType,
      },
      sort: [{ createdAt: 'desc' as const }],
      limit,
    };

    const result = await this.db.find(query);
    return result.docs;
  }

  async findUnreadByNotifiableId(
    notifiableId: string,
    notifiableType = 'User',
  ): Promise<Notification[]> {
    const query: MangoQuery = {
      selector: {
        type: 'notification',
        notifiableId,
        notifiableType,
        readAt: { $exists: false },
      },
      limit: 100,
    };

    const result = await this.db.find(query);
    return result.docs;
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findById(id);

    const updatedNotification: Notification = {
      ...notification,
      readAt: new Date().toISOString(),
    };

    const response = await this.db.insert(updatedNotification);
    return { ...updatedNotification, _rev: response.rev };
  }

  async markAllAsRead(
    notifiableId: string,
    notifiableType = 'User',
  ): Promise<number> {
    const unread = await this.findUnreadByNotifiableId(
      notifiableId,
      notifiableType,
    );
    const now = new Date().toISOString();

    let count = 0;
    for (const notification of unread) {
      if (notification._id && notification._rev) {
        await this.db.insert({
          ...notification,
          readAt: now,
        });
        count++;
      }
    }

    return count;
  }

  async remove(id: string): Promise<void> {
    const notification = await this.findById(id);
    if (!notification._rev) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    await this.db.destroy(id, notification._rev);
  }

  async countUnread(
    notifiableId: string,
    notifiableType = 'User',
  ): Promise<number> {
    const unread = await this.findUnreadByNotifiableId(
      notifiableId,
      notifiableType,
    );
    return unread.length;
  }
}
