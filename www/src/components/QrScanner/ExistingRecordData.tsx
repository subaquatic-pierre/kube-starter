import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Divider,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  DialogActions,
  Chip,
  Button,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { formatDate } from 'utils/date';
import Image from 'next/image';
import { AttendRecord, reduceAttendRecord } from 'models/record';
import { UserProfile } from 'models/auth';
import { CheckCircleOutlined } from '@ant-design/icons';
import { addAttendRecordItem } from 'lib/attend';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { sleep } from 'utils/sleep';

interface Props {
  record: AttendRecord;
  closeDialog: () => void;
  admin: UserProfile;
  location: string;
}

const ExistingRecordData: React.FC<Props> = ({
  record,
  closeDialog,
  admin,
  location,
}) => {
  const [loading, setLoading] = useState(false);
  const handleAcceptClick = async () => {
    setLoading(true);
    await sleep(0.1);
    const res = await addAttendRecordItem(
      record.id,
      location,
      admin.id,
      record.profile.id,
    );

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
          <Image src={record.profile.profilePic.url} fill alt="img" />
        </Box>
        <Typography variant="h5" paragraph>
          {record.profile.nameOnCert}
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
          sx={{ fontSize: '2rem' }}
          color="success"
          disabled={loading}
          variant="contained"
        >
          Accept
        </Button>
      </DialogActions>
    </>
  );
};

export default ExistingRecordData;
