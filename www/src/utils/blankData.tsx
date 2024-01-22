import { Abstract } from 'models/abstract';
import { User, UserProfile } from 'models/auth';
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

export const adminUser: UserProfile = {
  id: 10,
  title: '',
  createdAt: '',
  updatedAt: '',
  status: 'confirmed',
  email: 'admin@codativity',
  firstName: 'Admin',
  lastName: 'Codativity',
  contact: '',
  user: blankUser
};

export const blankProfile: UserProfile = {
  ...adminUser,
  id: -1
};
