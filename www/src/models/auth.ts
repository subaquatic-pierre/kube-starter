import { ReactElement } from 'react';
import { blankUser } from 'utils/blankData';

export type User = {
  id: number;
  username: string;
  email: string;
  verified: boolean;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
  role: UserRoleEnum;
};

export type UserRoleEnum = 'admin' | 'user';

export type JWTToken = {
  iat: number;
  id: number;
  exp: number;
  str: string;
};

export type GuardProps = {
  children: ReactElement | null;
};

export const reduceProfile = (data: any): null => {
  try {
    const profile = {
      id: data.id,
      ...data.attributes
    };

    if (data.attributes?.user?.data) {
      const user = data.attributes.user.data;
      profile.user = {
        id: user.id,
        ...user.attributes,
        role: {
          id: user.attributes.role.data.id,
          ...user.attributes.role.data.attributes
        }
      };
    } else {
      profile.user = blankUser;
    }
    //

    return profile;
  } catch (e) {
    console.log('There was en error reducing profile');
    return null;
  }
};
