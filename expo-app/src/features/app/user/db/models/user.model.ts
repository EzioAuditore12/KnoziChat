import { Realm } from 'realm';

export class User extends Realm.Object<User> {
  id!: string;
  firstName!: string;
  middleName!: string;
  lastName!: string;
  phoneNumber!: Date;
  email!: string;
  avatar!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static primaryKey = 'id';
}
