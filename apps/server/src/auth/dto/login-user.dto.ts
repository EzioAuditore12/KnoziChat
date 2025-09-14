import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ maxLength: 20, example: '+917823132423' })
  @IsPhoneNumber()
  @MaxLength(20)
  phoneNumber: string;

  @ApiProperty({ maxLength: 16 })
  @IsString()
  password: string;
}
