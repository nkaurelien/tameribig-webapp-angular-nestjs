import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import type { DocumentScope, MangoQuery } from 'nano';
import { CouchDbService } from '../database/couchdb.service.js';
import { Topic } from './interfaces/topic.interface.js';
import { CreateTopicDto } from './dto/create-topic.dto.js';
import { UpdateTopicDto } from './dto/update-topic.dto.js';

const TOPICS_DB = 'topics';

@Injectable()
export class TopicsService implements OnModuleInit {
  private readonly logger = new Logger(TopicsService.name);
  private db: DocumentScope<Topic>;

  constructor(private readonly couchDbService: CouchDbService) {}

  async onModuleInit(): Promise<void> {
    this.db = await this.couchDbService.getOrCreateDatabase<Topic>(TOPICS_DB);

    await this.couchDbService.createIndex(TOPICS_DB, {
      index: { fields: ['name'] },
      name: 'name-index',
    });

    await this.couchDbService.createIndex(TOPICS_DB, {
      index: { fields: ['slug'] },
      name: 'slug-index',
    });

    this.logger.log('Topics database initialized');
  }

  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const now = new Date().toISOString();
    const slug = this.generateSlug(createTopicDto.name);

    const topic: Topic = {
      type: 'topic',
      name: createTopicDto.name,
      slug,
      picture: createTopicDto.picture,
      miniature: createTopicDto.miniature,
      description: createTopicDto.description,
      createdAt: now,
    };

    const response = await this.db.insert(topic);
    return { ...topic, _id: response.id, _rev: response.rev };
  }

  async findAll(limit = 100): Promise<Topic[]> {
    const query: MangoQuery = {
      selector: { type: 'topic', deletedAt: { $exists: false } },
      limit,
    };

    const result = await this.db.find(query);
    return result.docs;
  }

  async findById(id: string): Promise<Topic> {
    try {
      const topic = await this.db.get(id);
      if (topic.deletedAt) {
        throw new NotFoundException(`Topic with ID ${id} not found`);
      }
      return topic;
    } catch {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
  }

  async findBySlug(slug: string): Promise<Topic | null> {
    const query: MangoQuery = {
      selector: { type: 'topic', slug, deletedAt: { $exists: false } },
      limit: 1,
    };

    const result = await this.db.find(query);
    return result.docs[0] ?? null;
  }

  async findBySlugOrId(param: string): Promise<Topic | null> {
    const bySlug = await this.findBySlug(param);
    if (bySlug) return bySlug;

    try {
      return await this.findById(param);
    } catch {
      return null;
    }
  }

  async update(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    const existingTopic = await this.findById(id);

    const updatedTopic: Topic = {
      ...existingTopic,
      ...updateTopicDto,
      slug: updateTopicDto.name
        ? this.generateSlug(updateTopicDto.name)
        : existingTopic.slug,
      updatedAt: new Date().toISOString(),
    };

    const response = await this.db.insert(updatedTopic);
    return { ...updatedTopic, _rev: response.rev };
  }

  async remove(id: string): Promise<void> {
    const topic = await this.findById(id);
    if (!topic._rev) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
    await this.db.destroy(id, topic._rev);
  }

  async softDelete(id: string): Promise<Topic> {
    const topic = await this.findById(id);
    const deletedTopic: Topic = {
      ...topic,
      deletedAt: new Date().toISOString(),
    };

    const response = await this.db.insert(deletedTopic);
    return { ...deletedTopic, _rev: response.rev };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
