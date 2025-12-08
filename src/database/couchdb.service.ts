import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import type { ServerScope, DocumentScope, CreateIndexRequest } from 'nano';
import { COUCHDB_CONNECTION } from './couchdb.provider.js';

@Injectable()
export class CouchDbService implements OnModuleInit {
  private readonly logger = new Logger(CouchDbService.name);

  constructor(@Inject(COUCHDB_CONNECTION) private readonly nano: ServerScope) {}

  async onModuleInit(): Promise<void> {
    try {
      const info = await this.nano.db.list();
      this.logger.log(`Connected to CouchDB. Databases: ${info.join(', ')}`);
    } catch (error) {
      this.logger.error('Failed to connect to CouchDB', error);
    }
  }

  async getOrCreateDatabase<T>(dbName: string): Promise<DocumentScope<T>> {
    try {
      await this.nano.db.get(dbName);
    } catch {
      this.logger.log(`Creating database: ${dbName}`);
      await this.nano.db.create(dbName);
    }
    return this.nano.use<T>(dbName);
  }

  getDatabase<T>(dbName: string): DocumentScope<T> {
    return this.nano.use<T>(dbName);
  }

  async ensureDatabase(dbName: string): Promise<void> {
    try {
      await this.nano.db.get(dbName);
    } catch {
      await this.nano.db.create(dbName);
      this.logger.log(`Database created: ${dbName}`);
    }
  }

  async createIndex(
    dbName: string,
    indexDef: CreateIndexRequest,
  ): Promise<void> {
    const db = this.nano.use(dbName);
    try {
      await db.createIndex(indexDef);
      this.logger.log(`Index ${indexDef.name} created on ${dbName}`);
    } catch (error) {
      this.logger.warn(`Index creation failed: ${error}`);
    }
  }
}
