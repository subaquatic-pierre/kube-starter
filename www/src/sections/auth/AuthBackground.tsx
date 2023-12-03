// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// types
import { ThemeDirection, ThemeMode } from 'types/config';
import Image from 'next/image';
import { basePath } from 'utils/const';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'block' },
        position: 'absolute',
        filter: 'blur(2px)',
        zIndex: -1,
        right: 100,
        bottom: 100
        // transform:
        //   theme.direction === ThemeDirection.RTL ? 'rotate(180deg)' : 'inherit',
      }}
    >
      {/* <Box height="100%" width="100%"> */}
      <Image
        src={`${basePath}/images/tech-rings.svg`}
        style={{
          filter: 'opacity(0.5) drop-shadow(0 0 0 blue)'
        }}
        alt="authBg"
        height={800}
        width={800}
      />
    </Box>
  );
};

export default AuthBackground;
