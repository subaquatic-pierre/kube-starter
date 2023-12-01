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
import ProfileRadialChart from '../user/ProfileRadialChart';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// types
import { ThemeDirection } from 'types/config';
import { useRouter } from 'next/router';
import { UPDATE_PROFILE } from 'lib/endpoints';
import { strapiReqWithAuth } from 'lib/api';

import { useDispatch, useSelector } from 'store';
import { getUsers } from 'store/reducers/chat';
import {
  blankMessage,
  chatContactUser,
  newBlankMessage,
} from 'utils/blankData';
import { getAllMessages, insertChat } from 'store/reducers/chat';
import useAuth from 'hooks/useAuth';
import React, { useState } from 'react';
import { UserProfile } from 'models/auth';
import Loader from 'components/Loader';
import { updateProfile } from 'lib/profile';

interface Props {
  profile: Partial<UserProfile>;
}

const AdminTicketRejected: React.FC<Props> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { profile: admin, role } = useAuth();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { profileId, visitorSpeaker } = router.query;
  const isNewUser = profileId === 'new' || profileId === undefined;

  const handleMessageClick = async () => {
    if (!isNewUser) {
      router.push(`/admin/messages?userId=${profileId}`);
    }
  };

  const handleUnRejectClick = async () => {
    setLoading(true);
    try {
      if (!isNewUser && profileId) {
        Number.parseInt(profileId as string);

        await updateProfile({ rejected: false }, profileId as string);

        dispatch(
          openSnackbar({
            open: true,
            message: 'Settings updated successfully.',
            variant: 'alert',
            alert: {
              color: 'success',
            },
            close: false,
          }),
        );
      }
    } catch (e) {
      dispatch(
        openSnackbar({
          open: true,
          message: `There was an error updating settings`,
          variant: 'alert',
          alert: {
            color: 'error',
          },
          close: false,
        }),
      );
    } finally {
      setLoading(false);
      router.push(`/admin/${visitorSpeaker}/${profileId}/personal`);
    }
  };

  if (loading) return <Loader />;

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      sx={{ position: 'relative', zIndex: 5 }}
    >
      <Grid item xs={12} sm={8}>
        <Stack
          direction="row"
          spacing={matchDownSM ? 1 : 2}
          alignItems="center"
        >
          <Box sx={{ ml: { xs: 0, sm: 1 } }}>
            <ProfileRadialChart seriesProp={1} />
          </Box>
          <Stack spacing={0.75}>
            <Typography variant="h5">Ticket Rejected</Typography>
            <Typography variant="body2" color="secondary">
              User ticket has been rejected, send them a message.
            </Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid
        item
        sx={{
          mx: matchDownSM ? 2 : 3,
          my: matchDownSM ? 1 : 0,
          mb: matchDownSM ? 2 : 0,
        }}
        xs={matchDownSM ? 12 : 'auto'}
      >
        {role === 'admin' && (
          <Button
            sx={{ mr: 1 }}
            variant="contained"
            color="info"
            onClick={handleUnRejectClick}
            fullWidth={matchDownSM}
          >
            Un Reject
          </Button>
        )}

        <Button
          variant="contained"
          onClick={handleMessageClick}
          fullWidth={matchDownSM}
        >
          Send Message
        </Button>
      </Grid>
    </Grid>
  );
};

export default AdminTicketRejected;
