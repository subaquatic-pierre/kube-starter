import React, { useEffect, useRef, useState } from 'react';
import differenceInDays from 'date-fns/differenceInDays';
import isEqual from 'date-fns/isEqual';
import {
  Box,
  Divider,
  getButtonUtilityClass,
  useTheme,
  Typography,
  Button,
  Stack,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import QrReader from 'qr-scanner';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { sleep } from 'utils/sleep';
import { getProfile, strapiReqWithAuth } from 'lib/api';
import {
  GET_ATTEND_RECORD,
  GET_ATTEND_RECORD_BY_USER_ID,
  NEW_ATTEND_RECORD,
} from 'lib/endpoints';
import useAuth from 'hooks/useAuth';
import { AttendRecord, reduceAttendRecord } from 'models/record';
import { UserProfile } from 'models/auth';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

import {
  getDateByDay,
  getToday,
  getDayByDate,
  addDays,
  getCheckInKey,
  getDayLabelByDate,
  DAY_1,
} from './utils';

import QrScanner from './Scanner';
import { formatDate } from 'utils/date';
import Image from 'next/image';
import { CheckCircleOutlined } from '@ant-design/icons';
import { newAttendRecord } from 'lib/attend';

interface Props {
  profile: UserProfile;
  admin: UserProfile;
  location: string;
  closeDialog: () => void;
}

const NewRecordData: React.FC<Props> = ({
  profile,
  closeDialog,
  admin,
  location,
}) => {
  const [loading, setLoading] = useState(false);
  const handleAcceptClick = async () => {
    setLoading(true);
    await sleep(0.1);
    const res = await newAttendRecord(profile.id, admin.id, location);

    if (res.error) {
      dispatch(
        openSnackbar({
          open: true,
          message: `Error`,
          variant: 'alert',
          alert: {
            color: 'error',
          },
          close: false,
        }),
      );
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Success',
          variant: 'alert',
          alert: {
            color: 'success',
          },
          close: false,
        }),
      );
    }
    setLoading(false);
    closeDialog();
  };

  return (
    <>
      <DialogTitle>Attendance</DialogTitle>
      <Divider />
      <Stack minWidth={280} p={2} spacing={1} alignItems="center">
        <Box
          sx={{
            position: 'relative',
            borderRadius: '50%',
            overflow: 'hidden',
            height: 100,
            width: 100,
          }}
        >
          <Image src={profile.profilePic.url} fill alt="img" />
        </Box>
        <Typography variant="h5" paragraph>
          {profile.nameOnCert}
        </Typography>
      </Stack>
      <Box mb={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                align="center"
                sx={(theme) => ({
                  color: theme.palette.success.main,
                  fontSize: '2rem',
                })}
              >
                <CheckCircleOutlined />
              </TableCell>
              <TableCell align="center">
                <Chip label={location} color="info" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <DialogActions>
        {/* <Button onClick={closeDialog} color="warning" variant="contained">
          Cancel
        </Button> */}
        <Button
          onClick={handleAcceptClick}
          fullWidth
          disabled={loading}
          sx={{ fontSize: '2rem' }}
          color="success"
          variant="contained"
        >
          Accept
        </Button>
      </DialogActions>
    </>
  );
};

export default NewRecordData;
