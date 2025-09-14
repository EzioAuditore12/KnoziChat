import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlackListedRefreshToken } from './entities/black-list-refresh-token.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { LocalStrategy } from './stratergies/local.stratergy';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './configs/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './stratergies/jwt.stratergy';
import refreshJwtConfig from './configs/refresh-jwt.config';
import { RefreshJwtStrategy } from './stratergies/refresh-jwt.stratergy';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlackListedRefreshToken, User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
})
export class AuthModule {}
