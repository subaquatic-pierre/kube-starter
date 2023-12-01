import { ReactElement } from 'react';
import { FileUpload } from './file';
import { Abstract } from './abstract';
import { getProfileStatus } from 'lib/utils';
import { reduceAbstract } from 'models/abstract';
import { blankUser } from 'utils/blankData';

export type User = {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
};

export type UserProfile = {
  id: number;
  title: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  nameOnCert: string | null;
  order: number | null;
  contact: string | null;
  institution: string | null;
  nationality: string | null;
  language: string | null;
  dialCode: string | null;
  country: string | null;
  profileCompleted: boolean;
  attendanceConfirmed: boolean;
  rejected: boolean | null;
  bio: string | null;
  degree: string | null;
  status: UserProfileStatus | undefined;
  user: User;
  abstract: Abstract | null;
  profilePic: FileUpload | null;
  idImage: FileUpload | null;
  passportPhoto: FileUpload | null;
  attendanceType: AttendanceType;
  ticketUrl?: string | null;
  qrCodeUrl?: string | null;
  lastMessageTime?: Date | null;
  allowSocialMediaTerm?: string | null;
  confirmTrueTerm?: string | null;
};

export interface AttendanceType {
  day1: string | null;
  day2: string | null;
  day3: string | null;
}

export type UserRole = {
  id: number;
  name: string;
  description: string;
  type: UserRoleEnum;
  createdAt: string;
  updatedAt: string;
};

export type UserRoleEnum =
  | 'visitor'
  | 'speaker'
  | 'member'
  | 'admin'
  | 'author'
  | 'organizer';

export type UserProfileStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'incomplete'
  | 'unknown';

export type JWTToken = {
  iat: number;
  id: number;
  exp: number;
  str: string;
};

export type GuardProps = {
  children: ReactElement | null;
};

export type UserCardProps = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  role: string;
  visits: number;
  progress: number;
  status: string;
  orderStatus: string;
  contact: number;
  country: string;
  address: string;
  fatherName: string;
  about: string;
  avatar: number;
  skills: string[];
  time: string;
};

export const reduceProfile = (data: any): UserProfile | null => {
  try {
    const profile = {
      id: data.id,
      ...data.attributes,
      order: data.attributes.order ?? 5,
      abstract: null,
    };

    // if (data.attributes.user.data) {
    if (data.attributes.user.data) {
      const user = data.attributes.user.data;
      profile.user = {
        id: user.id,
        ...user.attributes,
        role: {
          id: user.attributes.role.data.id,
          ...user.attributes.role.data.attributes,
        },
      };
    } else {
      profile.user = blankUser;
    }
    // }

    const abstractData = reduceAbstract(data);
    profile.abstract = abstractData;
    const status = getProfileStatus(profile);
    profile['status'] = status;

    return profile;
  } catch (e) {
    console.log('There was en error reducing profile');
    return null;
  }
};
