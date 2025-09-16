import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { BaseResponseDto } from 'src/common/dto/send-response.dto';
import { TokensDto } from 'src/common/dto/tokens.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class RegisterUserDto extends CreateUserDto {}

export class VerifyRegisterUserDto {
  @ApiProperty({ example: '+91XXXXXXXXXX' })
  @IsPhoneNumber()
  @MaxLength(20)
  phoneNumber: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MaxLength(6)
  otp: string;
}

export class RegisterUserResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'Verification Otp Send Successfully' })
  declare message: string;

  @ApiProperty({ example: '+91XXXXXXXXXX' })
  phoneNumber: string;
}

export class VerifyRegisterUserResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'User Created Successfully' })
  declare message: string;

  @ApiProperty({ type: () => OmitType(UserDto, ['password']) })
  user: Omit<CreateUserDto, 'password'>;

  @ApiProperty({ type: () => TokensDto })
  tokens: TokensDto;
}
