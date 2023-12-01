import { useState } from 'react';

// material-ui
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Typography,
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import {
  FileDoneOutlined,
  MailOutlined,
  TranslationOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import { basePath } from 'utils/const';
import QrCode from 'components/QrCode';
import useAuth from 'hooks/useAuth';
import { UserProfile } from 'models/auth';
import { useRouter } from 'next/router';
import { generateTicket } from 'lib/ticket';
import Loader from 'components/Loader';
import { sleep } from 'utils/sleep';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { strapiReqWithAuth } from 'lib/api';
import { UPDATE_PROFILE } from 'lib/endpoints';
import { updateProfile } from 'lib/profile';

// ==============================|| TAB - TICKET ||============================== //

interface Props {
  profile: Partial<UserProfile>;
}

const AdminTabTicket: React.FC<Props> = ({ profile }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [disabledRefreshButton, setDisabledRefreshButton] = useState(false);

  const handleRefreshClick = async () => {
    try {
      setLoading(true);
      const res = await generateTicket(profile);

      const { ticketUrl, qrCodeUrl } = res;

      await updateProfile(
        { ticketUrl, qrCodeUrl, silent: true },
        `${profile.id}`,
      );

      await sleep(2);

      router.push(
        `/admin/${
          profile.user.role.type === 'visitor' ? 'visitors' : 'speakers'
        }/${profile.id}/ticket`,
      );

      dispatch(
        openSnackbar({
          open: true,
          message:
            'Ticket refreshed, please wait up to 5 minutes for new ticket.',
          variant: 'alert',
          alert: {
            color: 'success',
          },
          close: false,
        }),
      );

      setLoading(false);
    } catch (e) {
      dispatch(
        openSnackbar({
          open: true,
          message: `There was an error refreshing`,
          variant: 'alert',
          alert: {
            color: 'error',
          },
          close: false,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <MainCard title="Ticket">
      <Stack minHeight={{ xs: 450, md: 900 }} justifyContent="space-between">
        <Box display="flex" justifyContent="center">
          <Box
            width={{ xs: 315, md: 630 }}
            height={{ xs: 400, md: 800 }}
            sx={{ overflow: 'visible' }}
            position="relative"
          >
            {profile.ticketUrl && (
              <Image
                sizes="md"
                priority
                fill
                src={profile.ticketUrl}
                alt="ticket"
                style={{ objectFit: 'cover', overflow: 'visible' }}
              />
            )}
          </Box>
        </Box>
        <Box>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
            sx={{ mt: 2.5 }}
          >
            <Button
              onClick={handleRefreshClick}
              color="success"
              variant="contained"
              disabled={loading}
            >
              Refresh Ticket
            </Button>
            {profile.ticketUrl && (
              <>
                <Button
                  component="a"
                  href={profile.qrCodeUrl}
                  color="info"
                  download="qrCode.png"
                  variant="contained"
                >
                  Download QR
                </Button>
                <Button
                  component="a"
                  href={profile.ticketUrl}
                  download="ticket.png"
                  variant="contained"
                >
                  Download Ticket
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Stack>
    </MainCard>
  );
};

export default AdminTabTicket;
