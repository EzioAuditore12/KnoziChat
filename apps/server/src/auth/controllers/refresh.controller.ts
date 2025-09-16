import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshJwtAuthGuard } from '../guards/refresh-auth/refresh-auth.guard';
import { refreshTokensDto } from '../dto/refresh-token.dto';
import type { RefreshTokenStratergyReqParameters } from '../types/auth-jwt-payload';

@ApiTags('Authentication')
@Controller('auth')
export class RefreshController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh Tokens',
    description:
      'Here After sending authenticated refresh token in body, bot access and refesh token will be generated',
  })
  @ApiBody({ type: refreshTokensDto })
  refreshTokens(@Req() req: RefreshTokenStratergyReqParameters) {
    return this.authService.refreshToken({
      userId: req.user.id,
      refreshToken: req.user.refreshToken,
      expiredAt: req.user.expiredAt,
      createdAt: req.user.issuedAt,
    });
  }
}
