// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, CardMedia } from '@mui/material';

// project import
import useConfig from 'hooks/useConfig';
import Hero from 'sections/landing/Header';

// types
import { PresetColor, ThemeDirection, ThemeMode } from 'types/config';

// ==============================|| LANDING PAGE ||============================== //

const Landing = () => {
  const theme = useTheme();
  const { presetColor } = useConfig();

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh'
        }}
      >
        <CardMedia
          component="img"
          image={`/images/heroImage.png`}
          sx={{
            position: 'absolute',
            // objectPosition: 'center',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            zIndex: -1
            // display: { xs: 'none', md: 'block' }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            background: 'rgba(0,0,0,.5)',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            zIndex: -1
            // display: { xs: 'none', md: 'block' }
          }}
        />
        <Hero />
      </Box>
    </>
  );
};

export default Landing;
