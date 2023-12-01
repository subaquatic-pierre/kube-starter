// project import
import { useRouter } from 'next/router';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

import VisitorStats from './VisitorStats';
import SpeakerStats from './SpeakerStats';
import { UserProfile } from 'models/auth';
import useAuth from 'hooks/useAuth';
import AttendanceStats from './AttendanceStats';
import { AttendRecord } from 'models/record';
import { useEffect } from 'react';
import { getDuplicateRecords } from 'lib/attend';

interface Props {
  allUsers: UserProfile[];
  allRecords: AttendRecord[];
}

const DashStats: React.FC<Props> = ({ allUsers = [], allRecords = [] }) => {
  const { role: adminRole } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleDuplicates = async () => {
    // const duplicates = getDuplicateRecords(allRecords);
  };

  useEffect(() => {
    handleDuplicates();
  }, [allRecords]);

  return (
    <Grid container spacing={4}>
      {adminRole === 'admin' && (
        <Grid item xs={12} container>
          <AttendanceStats allRecords={allRecords} />
        </Grid>
      )}

      {(adminRole === 'author' || adminRole === 'admin') && (
        <Grid item xs={12} md={6}>
          <VisitorStats allUsers={allUsers} />
        </Grid>
      )}
      {adminRole === 'admin' && (
        <Grid item xs={12} md={6}>
          <SpeakerStats allUsers={allUsers} />
        </Grid>
      )}
    </Grid>
  );
};

export default DashStats;
