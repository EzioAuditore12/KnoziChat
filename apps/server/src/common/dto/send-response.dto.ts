import { ApiProperty } from '@nestjs/swagger';

export enum ResponseStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export class BaseResponseDto {
  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status: ResponseStatus;

  @ApiProperty({ example: 'Operation completed successfully.' })
  message: string;
}
