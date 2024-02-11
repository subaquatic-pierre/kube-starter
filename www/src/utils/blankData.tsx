import { User } from 'models/auth';
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

export const blankUser: User = {
  id: 0,
  username: 'user',
  email: 'email@email.com',
  verified: true,
  disabled: false,
  createdAt: '',
  updatedAt: '',
  role: 'admin'
};
