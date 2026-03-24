import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get nodeEnv(): string {
    return this.get('NODE_ENV', 'development');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get port(): number {
    return this.getNumber('PORT', 3000);
  }

  get appName(): string {
    return this.get('APP_NAME', 'Tameri');
  }

  get apiDomain(): string {
    return this.get('API_DOMAIN', 'http://localhost:3000');
  }

  get websiteDomain(): string {
    return this.get('WEBSITE_DOMAIN', 'http://localhost:3000');
  }

  get<T = string>(key: string, defaultValue?: T): T {
    return this.configService.get<T>(key) ?? defaultValue;
  }

  getNumber(key: string, defaultValue?: number): number {
    const value = this.configService.get<string>(key);
    return value ? Number(value) : (defaultValue ?? 0);
  }

  getBoolean(key: string, defaultValue = false): boolean {
    const value = this.configService.get<string>(key);
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
  }

  getOrThrow<T = string>(key: string): T {
    return this.configService.getOrThrow<T>(key);
  }
}
