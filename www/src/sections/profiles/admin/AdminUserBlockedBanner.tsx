// next
import NextLink from 'next/link';
import { renderToString } from 'react-dom/server';

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
import { UserProfile, UserRoleEnum } from 'models/auth';
import { uploadFile } from 'lib/upload';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QrCode from 'components/QrCode';
import { generateTicket } from 'lib/ticket';
import { useState } from 'react';
import Loader from 'components/Loader';

interface Props {
  profile: Partial<UserProfile>;
}

const AdminUserBlockedBanner: React.FC<Props> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { visitorSpeaker, profileId } = router.query;
  const isNewUser = profileId === 'new' || profileId === undefined;

  const { users } = useSelector((state) => state.chat);

  const handleClick = async () => {
    router.push(`/admin/${visitorSpeaker}/${profile.id}/settings`);
  };

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
            <Typography variant="h5">User Blocked</Typography>
            <Typography variant="body2" color="secondary">
              Go to user settings to unblock user
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
        <Button
          sx={{ mr: 1 }}
          variant="contained"
          onClick={handleClick}
          fullWidth={matchDownSM}
        >
          Settings
        </Button>
      </Grid>
    </Grid>
  );
};

export default AdminUserBlockedBanner;
