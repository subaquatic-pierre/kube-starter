import { Typography, Container } from '@mui/material';
import { useTheme } from '@mui/material';
import ShowCounter from 'components/ShowCounter/ShowCounter';
import { useCountdown } from 'hooks/useCountdown';
import { DAY_1 } from 'utils/date';

const Countdown = () => {
  const theme = useTheme();
  const [days, hours, minutes, seconds] = useCountdown(DAY_1);

  return (
    <>
      {days >= 0 && hours >= 0 && minutes >= 0 && seconds >= 0 && (
        <Container>
          <Typography variant="h5" color={theme.palette.secondary.main} mt={5}>
            Countdown to the Conference
          </Typography>
          <ShowCounter
            days={days}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
          />
        </Container>
      )}{' '}
    </>
  );
};

export default Countdown;
