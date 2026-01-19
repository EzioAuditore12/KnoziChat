import { database } from '@/db';

import { User } from '@/db/models/user.model';
import { USER_TABLE_NAME } from '@/db/schemas/user-table.schema';

import type { CreateUserDto } from './types';

export class UserRepository {
  async create(createUserDto: CreateUserDto) {
    return await database.write(async () => {
      return await database.get<User>(USER_TABLE_NAME).create((user) => {
        if (createUserDto.id !== undefined) user._raw.id = createUserDto.id;

        user.firstName = createUserDto.firstName;
        user.middleName = createUserDto.middleName;
        user.lastName = createUserDto.lastName;
        user.phoneNumber = createUserDto.phoneNumber;
        user.avatar = createUserDto.avatar;

        user.createdAt = createUserDto.createdAt;
        user.updatedAt = createUserDto.updatedAt;
      });
    });
  }

  async findAll() {
    return await database.get<User>(USER_TABLE_NAME).query().fetch();
  }

  async findById(id: string) {
    return await database.get<User>(USER_TABLE_NAME).find(id);
  }
}
