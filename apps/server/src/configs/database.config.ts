import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Equals, IsBoolean, Matches, validateSync } from 'class-validator';

class DatabaseEnvironmentVariables {
  @Equals('postgres', { message: 'Database must be of type postgres only' })
  DATABASE_TYPE: string;

  @Matches(/^postgresql:\/\/.+$/, {
    message: 'DATABASE_URL must be a valid PostgreSQL connection string.',
  })
  DATABASE_URL: string;

  @IsBoolean()
  DATABASE_AUTO_LOAD_ENTITIES: boolean;

  @IsBoolean()
  DATABASE_SYNCHRONIZE: boolean;
}

function validateDatabaseConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    DatabaseEnvironmentVariables,
    config,
    {
      enableImplicitConversion: true,
    },
  );
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

const validatedConfig = validateDatabaseConfig({
  DATABASE_TYPE: process.env.DATABASE_TYPE,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_AUTO_LOAD_ENTITIES:
    process.env.DATABASE_AUTO_LOAD_ENTITIES === 'true',
  DATABASE_SYNCHRONIZE: process.env.DATABASE_SYNCHRONIZE === 'true',
});

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: validatedConfig.DATABASE_TYPE as 'postgres',
  url: validatedConfig.DATABASE_URL,
  autoLoadEntities: validatedConfig.DATABASE_AUTO_LOAD_ENTITIES,
  synchronize: validatedConfig.DATABASE_SYNCHRONIZE,
};
