import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

// Configs
import { validateServerConfig } from './configs/server.config';
import { typeOrmConfig } from './configs/database.config';
import { bullMQConfig } from './configs/bullMQ.config';
import { throttlerModuleConfig } from './configs/throttler.config';
import { createCacheOptions } from './configs/cache.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validate: validateServerConfig,
    }),
    CacheModule.registerAsync({
      useFactory: createCacheOptions,
    }),
    ThrottlerModule.forRoot(throttlerModuleConfig),
    TypeOrmModule.forRoot(typeOrmConfig),
    BullModule.forRoot(bullMQConfig),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
