// material-ui
import { Box, Grid, Stack, Typography } from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import { AttendRecord } from 'models/record';
import { useEffect, useState } from 'react';
import { GenericCardProps, OverrideIcon } from 'types/root';
import { getOnlineAttend, getTotalAttend } from 'lib/attend';

// ==============================|| REPORT CARD ||============================== //

interface Props {
  primary: string;
  secondary: string;
  iconPrimary: OverrideIcon;
  color: string;
  day: Date;
  allRecords: AttendRecord[];
}

const VisitorReportCard: React.FC<Props> = ({
  primary,
  secondary,
  iconPrimary,
  color,
  day,
  allRecords,
}) => {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [onlineAttend, setOnlineAttend] = useState(0);
  const [totalSpeakers, setTotalSpeakers] = useState(0);

  const IconPrimary = iconPrimary!;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;

  const loadTotals = async () => {
    const totalSpeakers = getTotalAttend(day, allRecords, 'speaker');
    const totalVisitors = getTotalAttend(day, allRecords, 'visitor');
    const onlineAttend = getOnlineAttend(day, allRecords);
    setOnlineAttend(onlineAttend);
    setTotalSpeakers(totalSpeakers);
    setTotalVisitors(totalVisitors);
  };

  useEffect(() => {
    loadTotals();
  }, [allRecords]);

  return (
    <MainCard>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={12}>
          <Stack spacing={1.5}>
            <Typography variant="h4">{primary}</Typography>
            <Stack spacing={1}>
              {/* Visitors */}
              <Box>
                <Stack
                  width="100%"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="secondary"
                  >
                    Total Visitors
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="secondary"
                  >
                    {totalVisitors}
                  </Typography>
                </Stack>
              </Box>

              {/* Speakers */}
              <Box>
                <Stack
                  width="100%"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    Total Speakers
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    {totalSpeakers}
                  </Typography>
                </Stack>
              </Box>

              {/* Online */}
              <Box>
                <Stack
                  width="100%"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography variant="body1" fontWeight="bold" color="success">
                    Online Attendance
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="success">
                    {onlineAttend}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </Grid>
        {/* <Grid item md={2} xs={false}>
          <Typography variant="h2" style={{ color }}>
            {primaryIcon}
          </Typography>
        </Grid> */}
      </Grid>
    </MainCard>
  );
};

export default VisitorReportCard;
