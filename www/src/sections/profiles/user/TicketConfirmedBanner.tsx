// next
import NextLink from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  useMediaQuery,
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

// project import
import BackLeft from './UserProfileBackLeft';
import BackRight from './UserProfileBackRight';
import MainCard from 'components/MainCard';
import ProfileRadialChart from './ProfileRadialChart';

// types
import { ThemeDirection } from 'types/config';

const TicketConfirmedBanner = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      sx={{ position: 'relative', zIndex: 5 }}
    >
      <Grid item xs={12} sm={8}>
        <Stack
          direction="row"
          spacing={matchDownSM ? 1 : 2}
          alignItems="center"
        >
          <Box sx={{ ml: { xs: 0, sm: 1 } }}>
            <ProfileRadialChart seriesProp={100} />
          </Box>
          <Stack spacing={0.75}>
            <Typography variant="h5">Your Ticket is confirmed!</Typography>
            {/* <Typography variant="body2" color="secondary">
              As this is the First International Forensic Sciences Conference
              organized by Ras Al Khaimah police, we are proud to announce that
              the first 30 approved papers will be free of registration and
              attendance fees, attendance includes, ID, coffee break , lunch,
              certificate of attendance.
            </Typography> */}
          </Stack>
        </Stack>
      </Grid>
      <Grid
        item
        sx={{
          mx: matchDownSM ? 2 : 3,
          my: matchDownSM ? 1 : 0,
          mb: matchDownSM ? 2 : 0,
        }}
        xs={matchDownSM ? 12 : 'auto'}
      >
        {/* <NextLink href="/profile/ticket" passHref legacyBehavior>
          <Button variant="contained" fullWidth={matchDownSM}>
            View Ticket
          </Button>
        </NextLink> */}
      </Grid>
    </Grid>
  );
};

export default TicketConfirmedBanner;
