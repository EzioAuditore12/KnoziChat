export type UserDto = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  phoneNumber: string;
  email: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserDto = Omit<UserDto, 'id'> & { id?: string };
