import { useRealm } from '@realm/react';

import type { UserType } from '../types/user.type';
import { User } from '../models/user.model';

export const useInsertIntoUserDB = () => {
  const realm = useRealm();

  return (data: UserType) => {
    realm.write(() => {
      realm.create(User, data);
    });
  };
};
