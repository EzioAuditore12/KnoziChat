import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import refreshJwtConfig from './configs/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { BlackListedRefreshToken } from './entities/black-list-refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    @InjectRepository(BlackListedRefreshToken)
    private blackListedRefreshTokenRepo: Repository<BlackListedRefreshToken>,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const user = await this.userService.findByPhoneNumber(
      registerUserDto.phoneNumber,
    );

    if (user)
      throw new ConflictException('User with this phone number already exists');

    const createdUser = await this.userService.create(registerUserDto);

    return createdUser;
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.findByPhoneNumber(
      loginUserDto.phoneNumber,
    );

    if (!user)
      throw new NotFoundException('User with this phone number does not exist');

    const { password: userPassword, ...userDetails } = user;

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      userPassword,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException(
        'Either entered email is wrong or password',
      );

    return userDetails;
  }

  generateTokens(userId: string) {
    const payload: Pick<AuthJwtPayload, 'sub'> = { sub: userId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);
    return {
      accessToken,
      refreshToken,
    };
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
    const user = await this.userService.findOne(userId);

    if (!user) throw new NotFoundException('Given user does not exist');

    await this.blackListedRefreshTokenRepo.save({
      userId,
      refreshToken,
      createdAt,
      expiredAt,
    });

    return this.generateTokens(userId);
  }

  async insertBlackListedRefreshToken({
    userId,
    refreshToken,
    issuedAt,
    expiredAt,
  }: {
    userId: string;
    refreshToken: string;
    issuedAt: Date;
    expiredAt: Date;
  }) {
    const insertBlaclistedToken = this.blackListedRefreshTokenRepo.create({
      userId,
      refreshToken,
      createdAt: issuedAt,
      expiredAt,
    });

    await this.blackListedRefreshTokenRepo.save(insertBlaclistedToken);
  }

  async findBlackListedRefreshToken(refreshToken: string) {
    return this.blackListedRefreshTokenRepo.findOne({
      where: { refreshToken },
    });
  }
}
