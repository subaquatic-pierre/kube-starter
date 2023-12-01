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

// ==============================|| TAB - SETTINGS ||============================== //

const TabTicket: React.FC = () => {
  const { profile } = useAuth();

  return (
    <MainCard title="Ticket">
      <Stack minHeight={{ xs: 450, md: 900 }} justifyContent="space-between">
        {profile.ticketUrl && (
          <Box display="flex" justifyContent="center">
            <Box
              width={{ xs: 315, md: 630 }}
              height={{ xs: 400, md: 800 }}
              sx={{ overflow: 'visible' }}
              position="relative"
            >
              <Image
                fill
                src={profile.ticketUrl}
                alt="ticket"
                style={{ objectFit: 'cover', overflow: 'visible' }}
              />
            </Box>
          </Box>
        )}
        {profile.ticketUrl && (
          <Box>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
              sx={{ mt: 2.5 }}
            >
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
            </Stack>
          </Box>
        )}
      </Stack>
    </MainCard>
  );
};

export default TabTicket;
