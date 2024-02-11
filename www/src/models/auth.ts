import { ReactElement } from 'react';
import { getProfileStatus } from 'lib/utils';
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

export type UserProfile = {
  id: number;
  title: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
  firstName: string | null;
  lastName: string | null;
  contact: string | null;
  status: UserProfileStatus | undefined;
  user: User;
};

export type UserRoleEnum = 'visitor' | 'speaker' | 'member' | 'admin' | 'author' | 'organizer';

export type UserProfileStatus = 'pending' | 'confirmed' | 'rejected' | 'incomplete' | 'unknown';

export type JWTToken = {
  iat: number;
  id: number;
  exp: number;
  str: string;
};

export type GuardProps = {
  children: ReactElement | null;
};

export const reduceProfile = (data: any): UserProfile | null => {
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

    const status = getProfileStatus(profile);
    profile['status'] = status;

    return profile;
  } catch (e) {
    console.log('There was en error reducing profile');
    return null;
  }
};
