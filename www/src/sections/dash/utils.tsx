import { Button, Chip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import { UserProfile } from 'models/auth';
import { FileUpload } from 'models/file';
import { ProfileLog } from 'models/profileLog';
import { Cell, Row } from 'react-table';
import { DropzoneFileUpload } from 'types/dropzone';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatDate } from 'utils/date';
import { Notification } from 'models/notification';
import Link from 'next/link';

export const buildNotificationTableColumns = () => [
  {
    Header: 'Time',
    accessor: 'time',
    Cell: ({ row }: Cell<Notification>) => {
      const time = row.values.time;
      return <Box>{formatDate(time, 'DD-MM-YYYY h:mm A')}</Box>;
    },
  },

  // {
  //   Header: 'Admin',
  //   accessor: 'toUser',
  //   Cell: ({ row }: Cell<Notification>) => {
  //     const admin = row.values.toUser;
  //     const name = `${admin.firstName} ${admin.lastName}`;
  //     return <Box>{name}</Box>;
  //   },
  // },
  {
    Header: 'Content',
    accessor: 'content',
  },
  {
    Header: 'Type',
    accessor: 'type',
    Cell: ({ row }: Cell<Notification>) => {
      const { type } = row.original;
      return getNotificationChip(type);
    },
  },
];

export const getNotificationChip = (type: string) => {
  switch (type) {
    case 'profileUpdate':
      return (
        <Chip
          color="info"
          label="Profile Updated"
          size="small"
          variant="light"
        />
      );
    case 'profileComplete':
      return (
        <Chip
          color="info"
          label="Profile Completed"
          size="small"
          variant="light"
        />
      );
    case 'userRegister':
      return (
        <Chip color="info" label="User Register" size="small" variant="light" />
      );
    case 'newAbstract':
      return (
        <Chip
          color="success"
          label="New Abstract"
          size="small"
          variant="light"
        />
      );
    case 'profileUpdate':
    default:
      return <Chip color="info" label="Update" size="small" variant="light" />;
  }
};
export const buildMessageTableColumns = () => [
  {
    Header: 'Time',
    accessor: 'createdAt',
    Cell: ({ row }: Cell<Notification>) => {
      const time = row.values.createdAt;
      return <Box>{formatDate(time, 'DD-MM-YYYY h:mm A')}</Box>;
    },
  },
  {
    Header: 'Content',
    accessor: 'content',
  },
  {
    Header: 'From',
    accessor: 'fromUser',
    Cell: ({ row }: Cell<Notification>) => {
      const user = row.values.fromUser;
      const name = `${user.firstName} ${user.lastName}`;
      return <Box>{name}</Box>;
    },
  },
];
