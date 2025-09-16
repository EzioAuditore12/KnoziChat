import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedDto {
  @ApiProperty({ type: 'string', example: 'Unauthroized Request' })
  message: string = 'Unauthroized Request';

  @ApiProperty({ example: 'Not Found' })
  error: string = 'Unauthroized';

  @ApiProperty({ type: 'number', example: 401 })
  statusCode: number = 401;
}
