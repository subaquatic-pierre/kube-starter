import { Chip } from '@mui/material';
import { User } from 'models/auth';

export const getStatusChipFromProfile = (profile: Partial<User>) => {
  const { verified } = profile;

  if (verified) {
    return <Chip color="success" label="Verified" size="small" variant="light" />;
  }
  if (verified) {
    return <Chip color="error" label="Blocked" size="small" variant="light" />;
  }
};
