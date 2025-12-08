import { Global, Module } from '@nestjs/common';
import { couchdbProvider } from './couchdb.provider.js';
import { CouchDbService } from './couchdb.service.js';

@Global()
@Module({
  providers: [couchdbProvider, CouchDbService],
  exports: [couchdbProvider, CouchDbService],
})
export class DatabaseModule {}
