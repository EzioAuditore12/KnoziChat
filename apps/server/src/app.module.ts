import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Configs
import { validateServerConfig } from './configs/server.config';
import { getTypeOrmOptions } from './configs/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validate: validateServerConfig,
    }),
    TypeOrmModule.forRoot(getTypeOrmOptions()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
