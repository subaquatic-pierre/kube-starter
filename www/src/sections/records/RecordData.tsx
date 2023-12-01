import React from 'react';
import {
  Box,
  Divider,
  Typography,
  Button,
  Stack,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { UserProfile } from 'models/auth';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

import Image from 'next/image';
import { CheckCircleOutlined } from '@ant-design/icons';
import { newAttendRecord } from 'lib/attend';
import { AttendRecord } from 'models/record';
import Link from 'next/link';
import { formatDate } from 'utils/date';

interface Props {
  record: AttendRecord;
}

const RecordData: React.FC<Props> = ({ record }) => {
  const { profile } = record;

  return (
    <>
      <DialogTitle>Attendance</DialogTitle>
      <Divider />
      <Stack minWidth={300} p={2} spacing={1} alignItems="center">
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
              <TableCell>Time</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {record.records.map((item, i) => (
              <TableRow key={i}>
                <TableCell sx={(theme) => ({})}>
                  {formatDate(item.time, 'DD-MM-YYYY h:mm A')}
                </TableCell>
                <TableCell>
                  {item.location}
                  {/* <Chip label={item.location} color="info" /> */}
                </TableCell>
                <TableCell>
                  {item.type}
                  {/* <Chip label={item.location} color="info" /> */}
                </TableCell>
                <TableCell
                  sx={{
                    '& a': { all: 'unset', '&:hover': { cursor: 'pointer' } },
                  }}
                >
                  {item.admin.firstName} {item.admin.lastName}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <DialogActions>
        {/* <Button onClick={closeDialog} color="warning" variant="contained">
          Cancel
        </Button> */}
        <Link
          href={`/admin/${
            profile.user.role.type === 'visitor' ? 'visitors' : 'speakers'
          }/${profile.id}/personal`}
        >
          <Button fullWidth color="info" variant="contained">
            View Profile
          </Button>
        </Link>
      </DialogActions>
    </>
  );
};

export default RecordData;
