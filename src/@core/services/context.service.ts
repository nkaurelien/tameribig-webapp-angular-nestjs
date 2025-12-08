import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';

export interface RequestContext {
  requestId?: string;
  userId?: string;
  [key: string]: unknown;
}

const asyncLocalStorage = new AsyncLocalStorage<Map<string, unknown>>();

@Injectable()
export class ContextService {
  static run<T>(callback: () => T): T {
    return asyncLocalStorage.run(new Map(), callback);
  }

  static get<T>(key: string): T | undefined {
    const store = asyncLocalStorage.getStore();
    return store?.get(key) as T | undefined;
  }

  static set(key: string, value: unknown): void {
    const store = asyncLocalStorage.getStore();
    store?.set(key, value);
  }

  static getStore(): Map<string, unknown> | undefined {
    return asyncLocalStorage.getStore();
  }
}
