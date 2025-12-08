import { Injectable } from '@nestjs/common';
import { randomUUID, createHmac } from 'node:crypto';

@Injectable()
export class GeneratorService {
  uuid(): string {
    return randomUUID();
  }

  fileName(ext: string): string {
    return `${this.uuid()}.${ext}`;
  }

  hmacHash(data: string, secret: string, algorithm = 'sha256'): string {
    return createHmac(algorithm, secret).update(data).digest('hex');
  }
}
