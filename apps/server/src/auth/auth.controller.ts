import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { FastifyReply } from 'fastify';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshJwtAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { refreshTokensDto } from './dto/refresh-token.dto';
import type { RefreshTokenStratergyReqParameters } from './types/auth-jwt-payload';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterUserDto })
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res() reply: FastifyReply,
  ) {
    const user = await this.authService.registerUser(registerUserDto);
    return reply.status(HttpStatus.CREATED).send(user);
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto })
  async login(@Body() loginUserDto: LoginUserDto, @Res() reply: FastifyReply) {
    const user = await this.authService.validateUser(loginUserDto);

    const tokens = this.authService.generateTokens(user.id);

    return reply.status(HttpStatus.ACCEPTED).send({
      user,
      tokens,
    });
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
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
