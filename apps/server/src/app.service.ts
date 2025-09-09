import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getCachedMessage(): Promise<any> {
    await this.cacheManager.set('cached_item', { key: 33 });
    const cachedItem = await this.cacheManager.get('cached_item');
    console.log(cachedItem);
    return cachedItem;
  }
}
