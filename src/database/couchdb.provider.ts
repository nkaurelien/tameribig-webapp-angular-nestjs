import { Provider } from '@nestjs/common';
import Nano from 'nano';

export const COUCHDB_CONNECTION = 'COUCHDB_CONNECTION';

export const couchdbProvider: Provider = {
  provide: COUCHDB_CONNECTION,
  useFactory: () => {
    const couchdbUrl =
      process.env.COUCHDB_URL || 'http://admin:admin@localhost:5984';
    return Nano(couchdbUrl);
  },
};
