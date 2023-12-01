import { Chip } from '@mui/material';
import { UserProfile } from 'models/auth';

export const getStatusChipFromProfile = (profile: Partial<UserProfile>) => {
  const { status, rejected, user } = profile;
  // if (rejected) {
  //   return <Chip color="error" label="Rejected" size="small" variant="light" />;
  // }

  let blocked = false;
  if (user && user.blocked) {
    blocked = true;
  }

  if (blocked) {
    return <Chip color="error" label="Blocked" size="small" variant="light" />;
  }
  switch (status) {
    case 'rejected':
      return (
        <Chip color="error" label="Rejected" size="small" variant="light" />
      );
    case 'pending':
      return <Chip color="info" label="Pending" size="small" variant="light" />;

    case 'confirmed':
      return (
        <Chip color="success" label="Confirmed" size="small" variant="light" />
      );
    case 'incomplete':
      return (
        <Chip color="warning" label="Incomplete" size="small" variant="light" />
      );
    default:
      return (
        <Chip color="warning" label="Unknown" size="small" variant="light" />
      );
  }
};
