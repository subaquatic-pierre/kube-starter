import { useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

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
  ApiOutlined,
} from '@ant-design/icons';
import { getProfiles, strapiReqWithAuth } from 'lib/api';
import { GET_USERS } from 'lib/endpoints';
import { UserProfile } from 'models/auth';
import useAuth from 'hooks/useAuth';
import VisitorReportCard from 'components/cards/statistics/VisitorReportCard';
import { DAY_1, DAY_2, DAY_3 } from 'utils/date';
import { AttendRecord } from 'models/record';

interface Props {
  allRecords: AttendRecord[];
}

const AttendanceStats: React.FC<Props> = ({ allRecords }) => {
  const theme = useTheme();

  return (
    <>
      <Grid item xs={12}>
        <Typography mb={2} variant="h5">
          Attendance Statistics
        </Typography>
      </Grid>
      <Grid item xs={12} container spacing={4}>
        <Grid item xs={12} md={4}>
          <VisitorReportCard
            primary="Day 1"
            day={DAY_1}
            secondary="Total Visitors"
            color={theme.palette.secondary.main}
            iconPrimary={BarChartOutlined}
            allRecords={allRecords}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <VisitorReportCard
            primary="Day 2"
            day={DAY_2}
            secondary="Total Events"
            color={theme.palette.error.main}
            iconPrimary={CalendarOutlined}
            allRecords={allRecords}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <VisitorReportCard
            primary="Day 3"
            day={DAY_3}
            secondary="Total Speakers"
            color={theme.palette.success.dark}
            iconPrimary={FileTextOutlined}
            allRecords={allRecords}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AttendanceStats;
