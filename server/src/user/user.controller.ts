import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import type { AuthRequest } from 'src/auth/types/auth-jwt-payload';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthRequest) {
    const user = this.userService.findOne(req.user.id);

    return plainToInstance(UserDto, user);
  }
}
