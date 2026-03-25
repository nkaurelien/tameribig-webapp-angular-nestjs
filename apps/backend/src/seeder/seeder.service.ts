import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { CouchDbService } from '../database/couchdb.service';
import {
  DEMO_TOPICS,
  DEMO_MEDIA,
  DEMO_SEARCH_SUGGESTIONS,
  DEMO_USERS,
  buildUserDocument,
} from './demo-data';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly couchDbService: CouchDbService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const demoMode =
      this.configService.get<string>('DEMO_MODE', 'false') === 'true';
    if (!demoMode) {
      this.logger.log('DEMO_MODE is not enabled. Skipping seed.');
      return;
    }

    this.logger.log('DEMO_MODE enabled — seeding demo data...');
    await this.seedAll();
    this.logger.log('Demo data seeding complete.');
  }

  async seedAll() {
    await this.seedUsers();
    await this.seedTopics();
    await this.seedMedia();
    await this.seedSearchSuggestions();
  }

  private async countUserDocs(dbName: string): Promise<number> {
    const db = await this.couchDbService.getOrCreateDatabase(dbName);
    const result = await db.list();
    return result.rows.filter((row) => !row.id.startsWith('_design/')).length;
  }

  async seedUsers() {
    const db = await this.couchDbService.getOrCreateDatabase('users');
    const count = await this.countUserDocs('users');

    if (count > 0) {
      this.logger.log(`Users: ${count} already exist — skipping.`);
      return;
    }

    const password = this.configService.get<string>(
      'DEMO_USER_PASSWORD',
      'Secret.1234',
    );

    let inserted = 0;
    for (const demoUser of DEMO_USERS) {
      try {
        // Create auth account in SuperTokens
        const signUpResult = await EmailPassword.signUp(
          'public',
          demoUser.email,
          password,
        );

        if (signUpResult.status === 'OK') {
          const supertokensId = signUpResult.user.id;
          const userDoc = buildUserDocument(demoUser, supertokensId);
          await db.insert(userDoc as any);
          inserted++;
          this.logger.log(
            `User created: ${demoUser.email} (roles: ${demoUser.roles.join(', ')})`,
          );
        } else {
          // User might already exist in SuperTokens
          this.logger.warn(
            `SuperTokens signup failed for ${demoUser.email}: ${signUpResult.status}`,
          );
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'unknown error';
        this.logger.warn(`Failed to create user "${demoUser.email}": ${msg}`);
      }
    }
    this.logger.log(`Users: seeded ${inserted} items.`);
  }

  async seedTopics() {
    const db = await this.couchDbService.getOrCreateDatabase('topics');
    const count = await this.countUserDocs('topics');

    if (count > 0) {
      this.logger.log(`Topics: ${count} already exist — skipping.`);
      return;
    }

    let inserted = 0;
    for (const topic of DEMO_TOPICS) {
      try {
        await db.insert(topic as any);
        inserted++;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'unknown error';
        this.logger.warn(`Failed to insert topic "${topic.name}": ${msg}`);
      }
    }
    this.logger.log(`Topics: seeded ${inserted} items.`);
  }

  async seedMedia() {
    const db = await this.couchDbService.getOrCreateDatabase('media');
    const count = await this.countUserDocs('media');

    if (count > 0) {
      this.logger.log(`Media: ${count} already exist — skipping.`);
      return;
    }

    let inserted = 0;
    for (const media of DEMO_MEDIA) {
      try {
        await db.insert(media as any);
        inserted++;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'unknown error';
        this.logger.warn(`Failed to insert media "${media.title}": ${msg}`);
      }
    }
    this.logger.log(`Media: seeded ${inserted} items.`);
  }

  async seedSearchSuggestions() {
    const db =
      await this.couchDbService.getOrCreateDatabase('search_suggestions');
    const count = await this.countUserDocs('search_suggestions');

    if (count > 0) {
      this.logger.log(`Search suggestions: ${count} already exist — skipping.`);
      return;
    }

    let inserted = 0;
    for (const suggestion of DEMO_SEARCH_SUGGESTIONS) {
      try {
        await db.insert(suggestion as any);
        inserted++;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'unknown error';
        this.logger.warn(
          `Failed to insert suggestion "${suggestion.search}": ${msg}`,
        );
      }
    }
    this.logger.log(`Search suggestions: seeded ${inserted} items.`);
  }
}
