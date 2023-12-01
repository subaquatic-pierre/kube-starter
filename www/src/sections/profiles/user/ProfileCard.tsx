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
import BackLeft from './UserProfileBackLeft';
import BackRight from './UserProfileBackRight';
import MainCard from 'components/MainCard';
import ProfileRadialChart from './ProfileRadialChart';

// types
import { ThemeDirection } from 'types/config';
import useAuth from 'hooks/useAuth';
import { UserProfile } from 'models/auth';

import CompleteProfileBanner from './CompleteProfileBanner';
import TicketConfirmedBanner from './TicketConfirmedBanner';
import TicketPendingBanner from './TicketPendingBanner';
import { useEffect, useState } from 'react';
import TicketRejectedBanner from './TicketRejectedBanner';

// ==============================|| USER PROFILE - TOP CARD ||============================== //

interface Props {
  focusInput: () => void;
}

const ProfileCard = ({ focusInput }: Props) => {
  const { profile } = useAuth();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const getTicketBanner = (profile: UserProfile): React.ReactElement => {
    switch (profile.status) {
      case 'rejected':
        return <TicketRejectedBanner />;
      case 'pending':
        return <TicketPendingBanner />;

      case 'confirmed':
        return <TicketConfirmedBanner />;

      case 'incomplete':
        return <CompleteProfileBanner />;

      case 'pending':
        return <TicketPendingBanner />;

      default:
        return <CompleteProfileBanner />;
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

export default ProfileCard;
