import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

// Configs
import { openApiDocsInit } from './configs/openApi.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  openApiDocsInit(app);

  await app.listen(process.env.PORT!);
}
void bootstrap();
