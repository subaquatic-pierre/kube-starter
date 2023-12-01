import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

interface Props {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ShowCounter = ({ days, hours, minutes, seconds }: Props): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack direction="row" className="show-counter counter-wrapper">
      <Box
        className="countdown"
        fontSize={{ xs: '1.5rem', sm: '2rem' }}
        padding={{ xs: '0.5rem !important', sm: '0.75rem' }}
      >
        <p>{days}</p>
        <span style={{ color: theme.palette.secondary.main }}>{'Days'}</span>
      </Box>
      <Box
        className="countdown"
        fontSize={{ xs: '1.5rem', sm: '2rem' }}
        padding={{ xs: '0.5rem !important', sm: '0.75rem' }}
      >
        <p>{hours}</p>
        <span style={{ color: theme.palette.secondary.main }}>{'Hours'}</span>
      </Box>
      <Box
        className="countdown"
        fontSize={{ xs: '1.5rem', sm: '2rem' }}
        padding={{ xs: '0.5rem !important', sm: '0.75rem' }}
      >
        <p>{minutes}</p>
        <span style={{ color: theme.palette.secondary.main }}>{'Mins'}</span>
      </Box>
      <Box
        className="countdown"
        fontSize={{ xs: '1.5rem', sm: '2rem' }}
        padding={{ xs: '0.5rem !important', sm: '0.75rem' }}
      >
        <p>{seconds}</p>
        <span style={{ color: theme.palette.secondary.main }}>{'Seconds'}</span>
      </Box>
    </Stack>
  );
};

export default ShowCounter;
