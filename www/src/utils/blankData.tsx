import { Abstract } from 'models/abstract';
import { User, UserProfile } from 'models/auth';
import { Message } from 'models/message';
import { Box } from '@mui/material';

const defaultFileUrl = `/images/avatar-group.png`;

export const blankProfileFiles = {
  profilePic: {
    filename: 'defaultProfilePic',
    url: defaultFileUrl
  },
  passportPhoto: {
    filename: 'defaultProfilePic',
    url: defaultFileUrl
  },
  idImage: {
    filename: 'defaultIdImage',
    url: defaultFileUrl
  }
};

const blankAbstract: Abstract = {
  profile: {} as UserProfile,
  id: 0,
  title: '',
  keywords: '',
  content: '',
  video: {
    filename: '',
    url: ''
  },
  document: {
    filename: '',
    url: ''
  }
};

export const blankUser: User = {
  id: 0,
  username: 'user',
  email: 'email@email.com',
  provider: 'local',
  confirmed: true,
  blocked: false,
  createdAt: '',
  updatedAt: '',
  role: {
    id: 0,
    description: '',
    createdAt: '',
    updatedAt: '',
    name: 'Admin',
    type: 'admin'
  }
};

export const blankProfile: UserProfile = {
  id: 0,
  title: '',
  order: 5,
  createdAt: '',
  updatedAt: '',
  status: 'confirmed',
  email: '',
  firstName: '',
  middleName: '',
  lastName: '',
  nameOnCert: '',
  contact: '',
  institution: '',
  country: '',
  rejected: false,
  profileCompleted: false,
  attendanceConfirmed: false,
  bio: '',
  degree: '',
  user: blankUser,
  abstract: blankAbstract as Abstract,
  profilePic: null,
  passportPhoto: null,
  idImage: null,
  nationality: '',
  language: '',
  dialCode: '',
  attendanceType: undefined
};

export const chatContactUser: UserProfile = {
  id: 0,
  title: '',
  order: 5,
  createdAt: '',
  updatedAt: '',
  status: 'confirmed',
  email: 'noreply@rakpolice.gov.ae',
  firstName: 'Contact',
  middleName: '',
  lastName: 'Us',
  nameOnCert: '',
  contact: '',
  institution: '',
  rejected: false,
  country: '',
  profileCompleted: false,
  attendanceConfirmed: false,
  bio: '',
  degree: '',
  user: blankUser,
  abstract: blankAbstract as Abstract,
  profilePic: {
    filename: 'defaultProfilePic',
    url: defaultFileUrl
  },
  passportPhoto: {
    filename: 'defaultProfilePic',
    url: defaultFileUrl
  },
  idImage: {
    filename: 'defaultIdImage',
    url: defaultFileUrl
  },
  nationality: '',
  language: '',
  dialCode: '',
  attendanceType: undefined
};
export const adminUser: UserProfile = {
  id: 10,
  title: '',
  createdAt: '',
  order: 5,
  updatedAt: '',
  status: 'confirmed',
  email: 'admin@codativity',
  firstName: 'Admin',
  middleName: '',
  lastName: 'Codativity',
  nameOnCert: '',
  contact: '',
  institution: '',
  country: '',
  rejected: false,
  profileCompleted: false,
  attendanceConfirmed: false,
  bio: '',
  degree: '',
  user: blankUser,
  abstract: blankAbstract as Abstract,
  profilePic: {
    filename: 'defaultProfilePic',
    url: defaultFileUrl
  },
  passportPhoto: {
    filename: 'defaultProfilePic',
    url: defaultFileUrl
  },
  idImage: {
    filename: 'defaultIdImage',
    url: defaultFileUrl
  },
  nationality: '',
  language: '',
  dialCode: '',
  attendanceType: undefined
};

export const blankMessage: Message = {
  id: 36,
  fullName: '',
  content: 'Contact Message',
  isContactMessage: false,
  contactEmail: 'contact@email.com',
  toUserRead: false,
  fromUserRead: true,
  createdAt: '2023-10-10T11:18:13.086Z',
  updatedAt: '2023-10-10T11:22:16.324Z',
  phoneNumber: '0987654',
  toUser: {
    id: 10,
    title: '',
    email: 'admin@codativity.com',
    createdAt: '2023-09-21T06:02:34.920Z',
    updatedAt: '2023-10-10T13:04:14.454Z',
    firstName: 'Admin',
    middleName: '',
    lastName: 'Codativity',
    nameOnCert: 'Admin Codativity',
    institution: 'Codativity',
    country: 'AF',
    contact: '0500504265',
    profileCompleted: true,
    attendanceConfirmed: false,
    bio: '',
    degree: '',
    abstract: {} as any,
    user: {} as any
  } as UserProfile,
  fromUser: {
    id: 10,
    title: '',
    email: 'admin@codativity.com',
    createdAt: '2023-09-21T06:02:34.920Z',
    updatedAt: '2023-10-10T13:04:14.454Z',
    firstName: 'Admin',
    middleName: '',
    lastName: 'Codativity',
    nameOnCert: 'Admin Codativity',
    institution: 'Codativity',
    country: 'AF',
    contact: '0500504265',
    profileCompleted: true,
    attendanceConfirmed: false,
    bio: '',
    degree: '',
    abstract: {} as any,
    user: {} as any
  } as UserProfile
};

export const newBlankMessage = (fromUser: UserProfile, toUser: UserProfile, content: string, id?: number): Message => ({
  ...blankMessage,
  id: id ?? blankMessage.id,
  createdAt: new Date().toISOString(),
  fromUser,
  toUser,
  content
});

export const generateRejectTemplate = () => {
  return <Box minWidth={{ xs: 300, md: 700 }}>REJECT TEMPLATE</Box>;
};
