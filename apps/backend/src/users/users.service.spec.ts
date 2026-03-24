import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CouchDbService } from '../database/couchdb.service';

describe('UsersService', () => {
  let service: UsersService;
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
        UsersService,
        {
          provide: CouchDbService,
          useValue: mockCouchDbService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    await service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const supertokensId = 'st-123';
      const createUserDto = { email: 'test@example.com' };
      const mockResponse = { id: 'user-1', rev: '1-abc' };

      mockDb.insert.mockResolvedValue(mockResponse);

      const result = await service.create(supertokensId, createUserDto);

      expect(result).toMatchObject({
        type: 'user',
        supertokensId,
        email: createUserDto.email,
        _id: mockResponse.id,
        _rev: mockResponse.rev,
      });
      expect(result.username).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(mockDb.insert).toHaveBeenCalledTimes(1);
    });

    it('should generate a unique username from email', async () => {
      const createUserDto = { email: 'john.doe@example.com' };
      mockDb.insert.mockResolvedValue({ id: 'user-1', rev: '1-abc' });

      const result = await service.create('st-123', createUserDto);

      expect(result.username).toMatch(/^johndoe_[a-z0-9]{4}$/);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        _id: 'user-1',
        _rev: '1-abc',
        type: 'user',
        email: 'test@example.com',
      };
      mockDb.get.mockResolvedValue(mockUser);

      const result = await service.findById('user-1');

      expect(result).toEqual(mockUser);
      expect(mockDb.get).toHaveBeenCalledWith('user-1');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockDb.get.mockRejectedValue(new Error('not found'));

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findBySupertokensId', () => {
    it('should return user by supertokens ID', async () => {
      const mockUser = {
        _id: 'user-1',
        supertokensId: 'st-123',
        email: 'test@example.com',
      };
      mockDb.find.mockResolvedValue({ docs: [mockUser] });

      const result = await service.findBySupertokensId('st-123');

      expect(result).toEqual(mockUser);
      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({ supertokensId: 'st-123' }),
        }),
      );
    });

    it('should return null when user not found', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });

      const result = await service.findBySupertokensId('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = { _id: 'user-1', email: 'test@example.com' };
      mockDb.find.mockResolvedValue({ docs: [mockUser] });

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
    });
  });

  describe('findByUsername', () => {
    it('should return user by username', async () => {
      const mockUser = { _id: 'user-1', username: 'johndoe_1234' };
      mockDb.find.mockResolvedValue({ docs: [mockUser] });

      const result = await service.findByUsername('johndoe_1234');

      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const existingUser = {
        _id: 'user-1',
        _rev: '1-abc',
        type: 'user',
        email: 'test@example.com',
        displayName: 'Old Name',
      };
      const updateDto = { displayName: 'New Name' };

      mockDb.get.mockResolvedValue(existingUser);
      mockDb.insert.mockResolvedValue({ id: 'user-1', rev: '2-def' });

      const result = await service.update('user-1', updateDto);

      expect(result.displayName).toBe('New Name');
      expect(result.updatedAt).toBeDefined();
      expect(result._rev).toBe('2-def');
    });
  });

  describe('softDelete', () => {
    it('should soft delete a user', async () => {
      const existingUser = {
        _id: 'user-1',
        _rev: '1-abc',
        type: 'user',
        email: 'test@example.com',
      };

      mockDb.get.mockResolvedValue(existingUser);
      mockDb.insert.mockResolvedValue({ id: 'user-1', rev: '2-def' });

      const result = await service.softDelete('user-1');

      expect(result.deletedAt).toBeDefined();
    });
  });

  describe('toPublicProfile', () => {
    it('should return only public fields', () => {
      const user = {
        _id: 'user-1',
        _rev: '1-abc',
        type: 'user' as const,
        supertokensId: 'st-123',
        email: 'test@example.com',
        username: 'testuser',
        displayName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        photoUrl: 'https://example.com/photo.jpg',
        about: 'About me',
        occupation: 'Developer',
        companyName: 'Tech Corp',
        roles: ['USER'],
        permissions: [],
        createdAt: new Date().toISOString(),
      };

      const result = service.toPublicProfile(user);

      expect(result._id).toBe(user._id);
      expect(result.username).toBe(user.username);
      expect(result.displayName).toBe(user.displayName);
      expect(result).not.toHaveProperty('email');
      expect(result).not.toHaveProperty('supertokensId');
      expect(result).not.toHaveProperty('roles');
    });
  });
});
