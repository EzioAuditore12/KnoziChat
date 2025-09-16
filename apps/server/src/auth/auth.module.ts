import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlackListedRefreshToken } from './entities/black-list-refresh-token.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './configs/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './stratergies/jwt.stratergy';
import refreshJwtConfig from './configs/refresh-jwt.config';
import { RefreshJwtStrategy } from './stratergies/refresh-jwt.stratergy';
import { UserAuthService } from './services/user-auth.service';
import { TokenService } from './services/token.service';
import { BlacklistRefreshTokenService } from './services/blacklist-refresh.service';
import { RegisterController } from './controllers/register.controller';
import { LoginController } from './controllers/login.controller';
import { RefreshController } from './controllers/refresh.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([BlackListedRefreshToken, User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  controllers: [RegisterController, LoginController, RefreshController],
  providers: [
    UserAuthService,
    TokenService,
    BlacklistRefreshTokenService,
    AuthService,
    UserService,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
})
export class AuthModule {}
