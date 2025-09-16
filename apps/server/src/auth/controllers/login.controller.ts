import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../auth.service';
import type { FastifyReply } from 'fastify';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto, LoginUserResponseDto } from '../dto/login-user.dto';
import { NotFoundDto } from 'src/common/dto/not-found.dto';
import { UnauthorizedDto } from 'src/common/dto/unauthorized.dto';

@ApiTags('Authentication')
@Controller('auth')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  @ApiBody({ type: LoginUserDto })
  @ApiAcceptedResponse({ type: LoginUserResponseDto })
  @ApiNotFoundResponse({ type: NotFoundDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async login(@Body() loginUserDto: LoginUserDto, @Res() reply: FastifyReply) {
    const user = await this.authService.validateUser(loginUserDto);

    const tokens = this.authService.generateTokens(user.id);

    return reply.status(HttpStatus.ACCEPTED).send({
      status: 'success',
      message: 'User logged in successfully',
      user,
      tokens,
    });
  }
}
