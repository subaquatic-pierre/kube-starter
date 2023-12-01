import { useEffect, useMemo, useState } from 'react';

// project import

import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

import { UserProfile } from 'models/auth';
import DashEmailConfirmation from './DashEmailConfirmation';
import DashTicketGen from './DashTicketGen';
import { AttendRecord } from 'models/record';
import DashCertGen from './DashCertGen';

interface Props {
  allUsers: UserProfile[];
  allRecords: AttendRecord[];
}

const DashActions: React.FC<Props> = ({ allUsers = [], allRecords = [] }) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <DashEmailConfirmation allUsers={allUsers} />
      </Grid>
      <Grid item xs={12} md={6}>
        <DashTicketGen allUsers={allUsers} />
      </Grid>
      {/*       
      <Grid item container xs={12} md={12}>
        <Grid item xs={12}>
          <Typography variant="h5">Generate Certificate</Typography>
        </Grid>
        <Grid item container spacing={4}>
          <Grid item xs={12} md={3}>
            <DashCertGen
              heading="Online"
              subTitle=""
              type="online"
              records={allRecords}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DashCertGen
              heading="Speakers"
              subTitle=""
              type="speaker"
              allUsers={allUsers}
              records={allRecords}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DashCertGen
              heading="Workshops"
              subTitle=""
              type="workshop"
              records={allRecords}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DashCertGen
              heading="In-Person"
              subTitle=""
              type="in-person"
              records={allRecords}
            />
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default DashActions;
