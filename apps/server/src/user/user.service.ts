import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { User } from './entities/user.entity';

// DTO's
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private UserRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.UserRepo.create(createUserDto);
    return await this.UserRepo.save(user);
  }

  async findOne(id: string) {
    const user = await this.UserRepo.findOne({ where: { id } });
    return user;
  }

  async findByPhoneNumber(phoneNumber: string) {
    return await this.UserRepo.findOne({ where: { phoneNumber } });
  }

  async findByEmail(email: string) {
    return await this.UserRepo.findOne({ where: { email } });
  }
}
