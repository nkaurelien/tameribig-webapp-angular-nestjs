import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CouchDbService } from '../database/couchdb.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let mockDb: {
    insert: jest.Mock;
    get: jest.Mock;
    find: jest.Mock;
    destroy: jest.Mock;
  };

  const mockCouchDbService = {
    getOrCreateDatabase: jest.fn(),
    createIndex: jest.fn(),
  };

  beforeEach(async () => {
    mockDb = {
      insert: jest.fn(),
      get: jest.fn(),
      find: jest.fn(),
      destroy: jest.fn(),
    };

    mockCouchDbService.getOrCreateDatabase.mockResolvedValue(mockDb);
    mockCouchDbService.createIndex.mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: CouchDbService,
          useValue: mockCouchDbService,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    await service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new notification', async () => {
      const createDto = {
        notifiableId: 'user-1',
        notifiableType: 'User',
        notificationType: 'new_message',
        data: { title: 'New message', body: 'You have a new message' },
      };
      const mockResponse = { id: 'notif-1', rev: '1-abc' };

      mockDb.insert.mockResolvedValue(mockResponse);

      const result = await service.create(createDto);

      expect(result).toMatchObject({
        type: 'notification',
        notifiableId: 'user-1',
        notifiableType: 'User',
        notificationType: 'new_message',
        _id: mockResponse.id,
      });
      expect(result.createdAt).toBeDefined();
      expect(result.readAt).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all notifications', async () => {
      const mockNotifications = [
        { _id: 'notif-1', type: 'notification' },
        { _id: 'notif-2', type: 'notification' },
      ];
      mockDb.find.mockResolvedValue({ docs: mockNotifications });

      const result = await service.findAll();

      expect(result).toEqual(mockNotifications);
    });
  });

  describe('findById', () => {
    it('should return notification by ID', async () => {
      const mockNotification = { _id: 'notif-1', type: 'notification' };
      mockDb.get.mockResolvedValue(mockNotification);

      const result = await service.findById('notif-1');

      expect(result).toEqual(mockNotification);
    });

    it('should throw NotFoundException when not found', async () => {
      mockDb.get.mockRejectedValue(new Error('not found'));

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByNotifiableId', () => {
    it('should return notifications for a user', async () => {
      const mockNotifications = [
        { _id: 'notif-1', notifiableId: 'user-1' },
        { _id: 'notif-2', notifiableId: 'user-1' },
      ];
      mockDb.find.mockResolvedValue({ docs: mockNotifications });

      const result = await service.findByNotifiableId('user-1');

      expect(result).toEqual(mockNotifications);
      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            notifiableId: 'user-1',
            notifiableType: 'User',
          }),
        }),
      );
    });
  });

  describe('findUnreadByNotifiableId', () => {
    it('should return only unread notifications', async () => {
      const mockUnread = [{ _id: 'notif-1', notifiableId: 'user-1' }];
      mockDb.find.mockResolvedValue({ docs: mockUnread });

      const result = await service.findUnreadByNotifiableId('user-1');

      expect(result).toEqual(mockUnread);
      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            readAt: { $exists: false },
          }),
        }),
      );
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const mockNotification = {
        _id: 'notif-1',
        _rev: '1-abc',
        type: 'notification',
        notifiableId: 'user-1',
      };
      mockDb.get.mockResolvedValue(mockNotification);
      mockDb.insert.mockResolvedValue({ id: 'notif-1', rev: '2-def' });

      const result = await service.markAsRead('notif-1');

      expect(result.readAt).toBeDefined();
      expect(result._rev).toBe('2-def');
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read', async () => {
      const mockUnread = [
        { _id: 'notif-1', _rev: '1-abc', notifiableId: 'user-1' },
        { _id: 'notif-2', _rev: '1-def', notifiableId: 'user-1' },
      ];
      mockDb.find.mockResolvedValue({ docs: mockUnread });
      mockDb.insert.mockResolvedValue({ ok: true });

      const result = await service.markAllAsRead('user-1');

      expect(result).toBe(2);
      expect(mockDb.insert).toHaveBeenCalledTimes(2);
    });

    it('should return 0 when no unread notifications', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });

      const result = await service.markAllAsRead('user-1');

      expect(result).toBe(0);
    });
  });

  describe('countUnread', () => {
    it('should return count of unread notifications', async () => {
      const mockUnread = [
        { _id: 'notif-1' },
        { _id: 'notif-2' },
        { _id: 'notif-3' },
      ];
      mockDb.find.mockResolvedValue({ docs: mockUnread });

      const result = await service.countUnread('user-1');

      expect(result).toBe(3);
    });
  });

  describe('remove', () => {
    it('should delete a notification', async () => {
      const mockNotification = { _id: 'notif-1', _rev: '1-abc' };
      mockDb.get.mockResolvedValue(mockNotification);
      mockDb.destroy.mockResolvedValue({ ok: true });

      await service.remove('notif-1');

      expect(mockDb.destroy).toHaveBeenCalledWith('notif-1', '1-abc');
    });
  });
});
