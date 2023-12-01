import { Box } from '@mui/system';
import { Cell } from 'react-table';

import { formatDate } from 'utils/date';
import { Notification } from 'models/notification';
import { AttendRecord } from 'models/record';

export const buildTableColumns = () => [
  {
    Header: 'First Name',
    accessor: 'profile',
    Cell: ({ row }: Cell<AttendRecord>) => {
      const profile = row.values.profile;
      return <Box>{profile.firstName}</Box>;
    },
  },
  {
    Header: 'Last Name',
    Cell: ({ row }: Cell<AttendRecord>) => {
      const profile = row.values.profile;
      return <Box>{profile.lastName}</Box>;
    },
  },
  {
    Header: 'Email',
    Cell: ({ row }: Cell<AttendRecord>) => {
      const profile = row.values.profile;
      return <Box>{profile.email}</Box>;
    },
  },
  {
    Header: 'Role',
    Cell: ({ row }: Cell<AttendRecord>) => {
      const role = row.values.profile.user.role.type;
      return <Box>{role}</Box>;
    },
  },
];
