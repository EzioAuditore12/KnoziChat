import { Injectable } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { BlacklistRefreshTokenService } from './services/blacklist-refresh.service';
import { UserAuthService } from './services/user-auth.service';
import {
  RegisterUserDto,
  VerifyRegisterUserDto,
} from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private blacklistRefreshTokenService: BlacklistRefreshTokenService,
    private userAuthService: UserAuthService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    return this.userAuthService.registerUser(registerUserDto);
  }

  async verifyRegisteration(verifyRegisterUserDto: VerifyRegisterUserDto) {
    return this.userAuthService.verifyUser(verifyRegisterUserDto);
  }

  async validateUser(loginUserDto: LoginUserDto) {
    return this.userAuthService.validateUser(loginUserDto);
  }

  generateTokens(userId: string) {
    return this.tokenService.generateTokens(userId);
  }

  async refreshToken({
    userId,
    expiredAt,
    createdAt,
    refreshToken,
  }: {
    userId: string;
    refreshToken: string;
    createdAt: Date;
    expiredAt: Date;
  }) {
    // Example: blacklist old token and issue new tokens
    await this.blacklistRefreshTokenService.insertBlackListedRefreshToken({
      userId,
      refreshToken,
      issuedAt: createdAt,
      expiredAt,
    });
    return this.tokenService.generateTokens(userId);
  }

  async findBlackListedRefreshToken(refreshToken: string) {
    return this.blacklistRefreshTokenService.findBlackListedRefreshToken(
      refreshToken,
    );
  }
}
