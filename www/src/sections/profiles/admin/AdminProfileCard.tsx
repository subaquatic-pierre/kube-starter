// next
import NextLink from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  useMediaQuery,
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// types
import { ThemeDirection } from 'types/config';
import useAuth from 'hooks/useAuth';
import { UserProfile } from 'models/auth';

import AdminTicketPendingBanner from './AdminTicketPendingBanner';
import ProfileRadialChart from '../user/ProfileRadialChart';
import BackLeft from '../user/UserProfileBackLeft';
import BackRight from '../user/UserProfileBackRight';
import { useEffect, useState } from 'react';
import AdminTicketRejected from './AdminTicketRejected';
import AdminUserBlockedBanner from './AdminUserBlockedBanner';

// ==============================|| USER PROFILE - TOP CARD ||============================== //

interface Props {
  profile: Partial<UserProfile>;
  focusInput: () => void;
}

const AdminProfileCard = ({ focusInput, profile }: Props) => {
  const { role: adminRole } = useAuth();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const getTicketBanner = (
    profile: Partial<UserProfile>,
  ): React.ReactElement => {
    const { user } = profile;

    if (adminRole === 'admin' && user.blocked) {
      return <AdminUserBlockedBanner profile={profile} />;
    }

    switch (profile.status) {
      case 'rejected':
        // TODO: send user message if
        return <AdminTicketRejected profile={profile} />;
      case 'pending':
        return <AdminTicketPendingBanner profile={profile} />;

      // case 'confirmed':
      //   return <TicketConfirmedBanner />;

      // case 'incomplete':
      //   return <CompleteProfileBanner />;

      // case 'pending':
      //   return <TicketPendingBanner />;

      default:
        return <></>;
    }
  };

  const [banner, setBanner] = useState(getTicketBanner(profile));

  useEffect(() => {
    if (profile) setBanner(getTicketBanner(profile));
  }, [profile]);

  return (
    <MainCard
      border={false}
      content={false}
      sx={{ bgcolor: 'primary.lighter', position: 'relative' }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: '-7px',
          left: 0,
          zIndex: 1,
          ...(theme.direction === ThemeDirection.RTL && {
            transform: 'rotate(180deg)',
            top: -7,
            bottom: 'unset',
          }),
        }}
      >
        <BackLeft />
      </Box>
      {banner}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1,
          ...(theme.direction === ThemeDirection.RTL && {
            transform: 'rotate(180deg)',
            top: -10,
            bottom: 'unset',
          }),
        }}
      >
        <BackRight />
      </Box>
    </MainCard>
  );
};

export default AdminProfileCard;
