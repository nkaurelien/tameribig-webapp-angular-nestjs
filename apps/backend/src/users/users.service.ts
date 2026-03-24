import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { DocumentScope, MangoQuery } from 'nano';
import { CouchDbService } from '../database/couchdb.service.js';
import { User, PublicUserProfile } from './interfaces/user.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

const USERS_DB = 'users';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);
  private db: DocumentScope<User>;

  constructor(private readonly couchDbService: CouchDbService) {}

  async onModuleInit(): Promise<void> {
    this.db = await this.couchDbService.getOrCreateDatabase<User>(USERS_DB);

    await this.couchDbService.createIndex(USERS_DB, {
      index: { fields: ['email'] },
      name: 'email-index',
    });

    await this.couchDbService.createIndex(USERS_DB, {
      index: { fields: ['supertokensId'] },
      name: 'supertokens-id-index',
    });

    await this.couchDbService.createIndex(USERS_DB, {
      index: { fields: ['username'] },
      name: 'username-index',
    });

    this.logger.log('Users database initialized');
  }

  async create(
    supertokensId: string,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const username = this.generateUsername(createUserDto.email);
    const now = new Date().toISOString();

    const user: User = {
      type: 'user',
      supertokensId,
      email: createUserDto.email,
      username,
      fullname: createUserDto.fullname,
      displayName: createUserDto.displayName,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phoneNumber: createUserDto.phoneNumber,
      photoUrl: createUserDto.photoUrl,
      about: createUserDto.about,
      occupation: createUserDto.occupation,
      companyName: createUserDto.companyName,
      roles: createUserDto.roles ?? ['USER'],
      permissions: [],
      socialLinks: createUserDto.socialLinks,
      address: createUserDto.address,
      views: { images: 0, creas: 0, audios: 0, videos: 0 },
      upvotes: { images: 0, creas: 0, audios: 0, videos: 0 },
      createdAt: now,
    };

    const response = await this.db.insert(user);
    return { ...user, _id: response.id, _rev: response.rev };
  }

  async findAll(): Promise<User[]> {
    const query: MangoQuery = {
      selector: { type: 'user' },
      limit: 100,
    };

    const result = await this.db.find(query);
    return result.docs;
  }

  async findById(id: string): Promise<User> {
    try {
      return await this.db.get(id);
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findBySupertokensId(supertokensId: string): Promise<User | null> {
    const query: MangoQuery = {
      selector: { type: 'user', supertokensId },
      limit: 1,
    };

    const result = await this.db.find(query);
    return result.docs[0] ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query: MangoQuery = {
      selector: { type: 'user', email },
      limit: 1,
    };

    const result = await this.db.find(query);
    return result.docs[0] ?? null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const query: MangoQuery = {
      selector: { type: 'user', username },
      limit: 1,
    };

    const result = await this.db.find(query);
    return result.docs[0] ?? null;
  }

  async findByUsernameOrId(param: string): Promise<User | null> {
    const byUsername = await this.findByUsername(param);
    if (byUsername) return byUsername;

    try {
      return await this.findById(param);
    } catch {
      return null;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.findById(id);

    const updatedUser: User = {
      ...existingUser,
      ...updateUserDto,
      updatedAt: new Date().toISOString(),
    };

    const response = await this.db.insert(updatedUser);
    return { ...updatedUser, _rev: response.rev };
  }

  async updateBySupertokensId(
    supertokensId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const existingUser = await this.findBySupertokensId(supertokensId);
    if (!existingUser?._id) {
      throw new NotFoundException(
        `User with SuperTokens ID ${supertokensId} not found`,
      );
    }

    return this.update(existingUser._id, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user._rev) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.db.destroy(id, user._rev);
  }

  async softDelete(id: string): Promise<User> {
    const user = await this.findById(id);
    const deletedUser: User = {
      ...user,
      deletedAt: new Date().toISOString(),
    };

    const response = await this.db.insert(deletedUser);
    return { ...deletedUser, _rev: response.rev };
  }

  async findOrCreateBySupertokensId(
    supertokensId: string,
    email: string,
  ): Promise<User> {
    const existing = await this.findBySupertokensId(supertokensId);
    if (existing) return existing;

    return this.create(supertokensId, { email });
  }

  private generateUsername(email: string): string {
    const base = email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const suffix = Math.random().toString(36).substring(2, 6);
    return `${base}_${suffix}`;
  }

  toPublicProfile(user: User): PublicUserProfile {
    return {
      _id: user._id,
      username: user.username,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      about: user.about,
      occupation: user.occupation,
      companyName: user.companyName,
      socialLinks: user.socialLinks,
    };
  }
}
