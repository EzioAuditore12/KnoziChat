import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../auth.service';
import type { FastifyReply } from 'fastify';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  RegisterUserDto,
  RegisterUserResponseDto,
  VerifyRegisterUserDto,
  VerifyRegisterUserResponseDto,
} from '../dto/register-user.dto';
import { ConflictDto } from 'src/common/dto/conflict.dto';
import { NotFoundDto } from 'src/common/dto/not-found.dto';

@ApiTags('Authentication')
@Controller('auth')
export class RegisterController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register User Form' })
  @ApiBody({ type: RegisterUserDto })
  @ApiCreatedResponse({ type: RegisterUserResponseDto })
  @ApiConflictResponse({ type: ConflictDto })
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res() reply: FastifyReply,
  ) {
    await this.authService.registerUser(registerUserDto);

    return reply.status(HttpStatus.CREATED).send({
      status: 'success',
      message: 'Otp Sent For Verification',
      phoneNumber: registerUserDto.phoneNumber,
    });
  }

  @Post('verify-register')
  @ApiOperation({ summary: 'Verify User Registeration' })
  @ApiBody({ type: VerifyRegisterUserDto })
  @ApiCreatedResponse({ type: VerifyRegisterUserResponseDto })
  @ApiConflictResponse({ type: NotFoundDto })
  async verifyRegisteration(
    @Body() verifyRegisterUserDto: VerifyRegisterUserDto,
    @Res() reply: FastifyReply,
  ) {
    const user = await this.authService.verifyRegisteration(
      verifyRegisterUserDto,
    );

    const tokens = this.authService.generateTokens(user.id);

    return reply.status(HttpStatus.CREATED).send({
      status: 'success',
      message: 'User Created Successfully',
      user,
      tokens,
    });
  }
}
