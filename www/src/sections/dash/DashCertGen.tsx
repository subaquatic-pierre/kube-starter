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

// types
import { ThemeMode } from 'types/config';

// assets
import { EyeOutlined, FullscreenExitOutlined } from '@ant-design/icons';
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
import { AttendRecord } from 'models/record';
import {
  generateCertificate,
  CertType,
  CertGenData,
  getInPersonCertData,
  getOnlineCertData,
  getSpeakerCertData,
  getWorkshopCertData,
} from 'lib/certificate';
import {
  generateAttendRecords,
  getDuplicateRecords,
  updateAttendRecord,
} from 'lib/attend';

interface Props {
  records: AttendRecord[];
  allUsers?: UserProfile[];
  heading: string;
  subTitle: string;
  type: CertType;
}

const DashCertGen: React.FC<Props> = ({
  records = [],
  allUsers = [],
  heading,
  subTitle,
  type,
}) => {
  const [sendProgress, setSendProgress] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);
  const cancel = useRef(false);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState<CertGenData[]>([]);

  const loadData = async () => {
    switch (type) {
      case 'in-person':
        const inPersonData = getInPersonCertData(records);
        setData(inPersonData);
        break;

      case 'online':
        const onlineData = getOnlineCertData(records);
        setData(onlineData);
        break;

      case 'speaker':
        const speakerData = getSpeakerCertData(records, allUsers);
        setData(speakerData);
        break;

      case 'workshop':
        const workshopData = getWorkshopCertData(records);
        setData(workshopData);

        break;

      default:
        break;
    }
  };

  const handleGenerateClick = async () => {
    cancel.current = false;

    const updateData = [...data];
    for (let i = 0; i < data.length; i++) {
      if (cancel.current) break;

      const genData = updateData[i];

      if (genData.status !== 'generated') {
        const certGenRes = await generateCertificate(genData);

        console.log(certGenRes);

        updateData[i].status = 'generated';

        // update progress in UI
        const numGenerated = updateData.filter(
          (item) => item.status === 'generated',
        ).length;

        setSendProgress((numGenerated / data.length) * 100);

        setLastIndex(i + 1);

        setData(updateData);
        await sleep(0.1);
      }
    }
  };

  const handleSingleClick = async (index: number) => {
    cancel.current = false;

    const updateData = [...data];

    const genData = updateData[index];

    const certGenRes = await generateCertificate(genData);

    console.log(certGenRes);

    // update progress in UI
    updateData[index].status = 'generated';

    const numGenerated = updateData.filter(
      (item) => item.status === 'generated',
    ).length;

    setSendProgress((numGenerated / data.length) * 100);

    setData(updateData);
  };

  const handleCancelClick = () => {
    cancel.current = true;
    setOpen(false);
  };

  useEffect(() => {
    loadData();
  }, [records]);

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
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
                    <ListItemText primary={heading} secondary={subTitle} />
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
            <Typography variant="h5">Records</Typography>

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
                  <TableCell>Record ID</TableCell>
                  <TableCell>Name on Certificate</TableCell>
                  <TableCell>Certificate Type</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>View Profile</TableCell>
                  <TableCell>Generate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.record.id}</TableCell>
                    <TableCell>{item.nameOnCert}</TableCell>
                    <TableCell>{item.type}</TableCell>
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
                          }/${item.profile.id}/certificate`}
                        >
                          <EyeOutlined />
                        </Link>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleSingleClick(i)}
                        sx={{
                          fontSize: '1.5rem',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <FullscreenExitOutlined />
                      </Button>
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

export default DashCertGen;
