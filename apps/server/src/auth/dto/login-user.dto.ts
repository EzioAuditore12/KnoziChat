import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { BaseResponseDto } from 'src/common/dto/send-response.dto';
import { TokensDto } from 'src/common/dto/tokens.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserDto } from 'src/user/dto/user.dto';

export class LoginUserDto {
  @ApiProperty({ maxLength: 20, example: '+917823132423' })
  @IsPhoneNumber()
  @MaxLength(20)
  phoneNumber: string;

  @ApiProperty({ maxLength: 16, example: 'Example@123' })
  @IsString()
  password: string;
}

export class LoginUserResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'User logged in successfully' })
  declare message: string;

  @ApiProperty({ type: () => OmitType(UserDto, ['password']) })
  user: Omit<CreateUserDto, 'password'>;

  @ApiProperty({ type: () => TokensDto })
  tokens: TokensDto;
}
