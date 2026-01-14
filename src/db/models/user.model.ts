import { date, text } from '@nozbe/watermelondb/decorators';

import { USER_TABLE_NAME } from '../schemas/user-table.schema';
import { BaseModel } from './base.model';

export class User extends BaseModel {
  static table = USER_TABLE_NAME;

  @text('first_name')
  firstName!: string;

  @text('middle_name')
  middleName!: string | null;

  @text('last_name')
  lastName!: string;

  @text('phone_number')
  phoneNumer!: string;

  @text('email')
  email!: string | null;

  @text('avatar')
  avatar!: string | null;

  @date('created_at')
  createdAt!: Date;

  @date('updated_at')
  updatedAt!: Date;
}
