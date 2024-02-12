import * as React from 'react';
import { useState } from 'react';

// next
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';

// material-ui
import AppBar from '@mui/material/AppBar';
import { useTheme } from '@mui/material/styles';
import {
  useMediaQuery,
  Box,
  Button,
  Chip,
  Container,
  Drawer,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger
} from '@mui/material';

// project import
import { APP_DEFAULT_PATH } from 'config';
import IconButton from 'components/@extended/IconButton';

import AnimateButton from 'components/@extended/AnimateButton';
import Logo from 'components/Logo';

// types
import { ThemeMode } from 'types/config';

// assets
import { MenuOutlined, LineOutlined } from '@ant-design/icons';
import useAuth from 'hooks/useAuth';

// ==============================|| COMPONENTS - APP BAR ||============================== //

// elevation scroll
function ElevationScroll({ layout, children, window }: any) {
  const theme = useTheme();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
    target: window ? window() : undefined
  });

  const backColorScroll = theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[800];
  const backColor = layout !== 'landing' ? backColorScroll : 'transparent';

  return React.cloneElement(children, {
    style: {
      backgroundColor: trigger ? backColorScroll : backColor
    }
  });
}

interface Props {
  handleDrawerOpen?: () => void;
  layout?: string;
}

const Header = ({ handleDrawerOpen, layout, ...others }: Props) => {
  const theme = useTheme();
  const { role } = useAuth();

  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerToggle, setDrawerToggle] = useState<boolean>(false);

  /** Method called on multiple components with different event types */
  const drawerToggler = (open: boolean) => (event: any) => {
    if (event.type! === 'keydown' && (event.key! === 'Tab' || event.key! === 'Shift')) {
      return;
    }
    setDrawerToggle(open);
  };

  return (
    <ElevationScroll layout={layout} {...others}>
      <AppBar>
        <Container disableGutters={matchDownMd}>
          <Toolbar sx={{ px: { xs: 1.5, md: 0, lg: 0 } }}>
            <Stack direction="row" sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} alignItems="center">
              <Typography component="div" sx={{ textAlign: 'left', display: 'inline-block' }}>
                <Logo reverse to="/" transparent />
              </Typography>
              <Chip
                label={'v1.0.0@beta'}
                variant="outlined"
                size="small"
                color="secondary"
                sx={{ mt: 0.5, ml: 1, fontSize: '0.725rem', height: 20, '& .MuiChip-label': { px: 0.5 } }}
              />
            </Stack>
            <Stack
              direction="row"
              sx={{
                '& .header-link': { px: 1, '&:hover': { color: theme.palette.primary.main } },
                display: { xs: 'none', md: 'block' }
              }}
              spacing={2}
            >
              <Box sx={{ display: 'inline-block' }}>
                <AnimateButton>
                  <Button component={Link} href="/login" disableElevation color="primary" variant="contained">
                    Login
                  </Button>
                </AnimateButton>
              </Box>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
};

Header.defaultProps = {
  layout: 'landing'
};

export default Header;
