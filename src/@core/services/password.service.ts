import { Injectable } from '@nestjs/common';
import { randomBytes, createHmac } from 'node:crypto';

export interface HashedPassword {
  salt: string;
  hash: string;
}

@Injectable()
export class PasswordService {
  static generateSalt(length = 128): string {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  static hash(password: string, salt?: string): HashedPassword {
    const usedSalt = salt ?? PasswordService.generateSalt();
    const hash = createHmac('sha512', usedSalt).update(password).digest('hex');
    return { salt: usedSalt, hash };
  }

  static verify(password: string, storedHash: string, salt: string): boolean {
    const { hash } = PasswordService.hash(password, salt);
    return hash === storedHash;
  }
}
