import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { throttlerConfig } from './configs/throttler.config';
import { typeOrmConfig } from './configs/database.config';
import { bullMQConfig } from './configs/bull-mq.config';
import { createCacheOptions } from './configs/cache.config';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      useFactory: createCacheOptions,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot(throttlerConfig),
    BullModule.forRoot(bullMQConfig),
    TypeOrmModule.forRoot(typeOrmConfig),
    CommonModule,
    UserModule,
    AuthModule,
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
