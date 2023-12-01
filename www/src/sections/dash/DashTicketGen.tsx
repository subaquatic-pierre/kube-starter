import { useEffect, useMemo, useRef, useState } from 'react';

// project import
import { useRouter } from 'next/router';

import { ReactElement } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

import Avatar from 'components/@extended/Avatar';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import MainCard from 'components/MainCard';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import ReportCard from 'components/cards/statistics/ReportCard';
import HoverSocialCard from 'components/cards/statistics/HoverSocialCard';
import RoundIconCard from 'components/cards/statistics/RoundIconCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import UserCountCard from 'components/cards/statistics/UserCountCard';

// types
import { ThemeMode } from 'types/config';

// assets
import {
  AimOutlined,
  BarChartOutlined,
  CalendarOutlined,
  ContactsOutlined,
  DownloadOutlined,
  EyeOutlined,
  FacebookOutlined,
  FileTextOutlined,
  FileProtectOutlined,
  FieldTimeOutlined,
  LinkedinOutlined,
  RedditOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  UserOutlined,
  MessageOutlined,
  NotificationOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import VisitorStats from './VisitorStats';
import SpeakerStats from './SpeakerStats';
import { getProfiles, strapiReqWithAuth } from 'lib/api';
import { GET_USERS } from 'lib/endpoints';
import { UserProfile, UserRoleEnum } from 'models/auth';
import { sendConfirmationEmail } from 'lib/auth';
import { sleep } from 'utils/sleep';
import Link from 'next/link';
import { generateTicket } from 'lib/ticket';
import { updateProfile } from 'lib/profile';

interface TicketGenData {
  nameOnCert: string;
  profileId: number;
  email: string;
  status: 'sent' | 'pending';
  role: UserRoleEnum;
  institution: string;
  profile: UserProfile;
}

interface Props {
  allUsers: UserProfile[];
}

const DashTicketGen: React.FC<Props> = ({ allUsers = [] }) => {
  const [sendProgress, setSendProgress] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);
  const cancel = useRef(false);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState<TicketGenData[]>([]);

  const loadData = async () => {
    const data: TicketGenData[] = [];

    for (const profile of allUsers) {
      if (
        profile.attendanceConfirmed === true &&
        (profile.user.role.type === 'speaker' ||
          profile.user.role.type === 'visitor')
      ) {
        const item: TicketGenData = {
          nameOnCert: profile.nameOnCert,
          email: profile.email,
          profileId: profile.id,
          role: profile.user.role.type,
          status: 'pending',
          institution: profile.institution,
          profile: profile,
        };
        data.push(item);
      }
    }

    setData(data);
  };

  const handleGenerateClick = async () => {
    cancel.current = false;

    const updateData = [...data];
    for (let i = 0; i < data.length; i++) {
      if (cancel.current) break;

      const profile = updateData[i].profile;

      const ticketGenRes = await generateTicket(profile, false);

      const { ticketUrl, qrCodeUrl } = ticketGenRes;

      const profileUpdateData = { ticketUrl, qrCodeUrl, silent: true };

      await updateProfile(profileUpdateData, `${profile.id}`);

      setSendProgress(((i + 1) / data.length) * 100);
      updateData[i].status = 'sent';
      setData(updateData);

      setLastIndex(i + 1);

      await sleep(0.2);
    }
  };

  const handleCancelClick = () => {
    cancel.current = true;
    setOpen(false);
  };

  useEffect(() => {
    loadData();
  }, [allUsers]);

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Regenerate User Tickets</Typography>
        </Grid>
        <MainCard sx={{ width: '100%', mt: 2 }}>
          <Grid container spacing={1.25}>
            <Grid item xs={12}>
              <Stack
                pb={2}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <List sx={{ pb: 0, maxWidth: { md: '80%' } }}>
                  <ListItem sx={{ p: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{}}>{data.length}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="All Confirmed Users"
                      secondary="Rebuild confirmed user ticket, no notification emails will be send to users."
                    />
                  </ListItem>
                </List>
                <Box>
                  <Stack spacing={2}>
                    <Button onClick={() => setOpen(true)} variant="contained">
                      View
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Typography mt={2}>Progress</Typography>
          </Grid>
          <Grid item xs={12}>
            <LinearWithLabel value={sendProgress} color="primary" />
          </Grid>
        </MainCard>
      </Grid>
      {/* Dialog Detail */}

      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">Users</Typography>

            {data.length > 0 && (
              <Stack direction="row" spacing={1}>
                {sendProgress > 0 && (
                  <Button
                    onClick={handleCancelClick}
                    color="error"
                    variant="contained"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleGenerateClick}
                  color="success"
                  variant="contained"
                >
                  Generate
                </Button>
              </Stack>
            )}
          </Stack>
        </DialogTitle>
        <Divider />
        <Box minWidth={{ md: 600, xs: 300 }}>
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name on Certificate</TableCell>
                  <TableCell>Email Address</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>View Profile</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.nameOnCert}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        color={item.status === 'pending' ? 'info' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          fontSize: '1.5rem',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          '& a': {
                            all: 'unset',
                            '&:hover': { cursor: 'pointer' },
                          },
                        }}
                      >
                        <Link
                          href={`/admin/${
                            item.role === 'speaker' ? 'speakers' : 'visitors'
                          }/${item.profileId}/ticket`}
                        >
                          <EyeOutlined />
                        </Link>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default DashTicketGen;
