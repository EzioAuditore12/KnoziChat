import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlackListedRefreshToken } from '../entities/black-list-refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlacklistRefreshTokenService {
  constructor(
    @InjectRepository(BlackListedRefreshToken)
    private blackListedRefreshTokenRepo: Repository<BlackListedRefreshToken>,
  ) {}

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
