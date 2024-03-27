import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import useScrollTrigger from '@mui/material/useScrollTrigger';

import Container from 'components/Container';
import TopNav from 'components/TopNav';

import { Topbar, Sidebar, Footer } from './components';
import Fab from 'components/Fab';

// import pages from '../navigation';

const pages = {
  landings: [],
  company: [],
  account: [],
  secondary: [],
  blog: [],
  portfolio: []
};

interface Props {
  children: React.ReactNode;
  colorInvert?: boolean;
  bgcolor?: string;
}

const Main = ({ children, colorInvert = false, bgcolor = 'transparent' }: Props): JSX.Element => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = (): void => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = (): void => {
    setOpenSidebar(false);
  };

  const open = isMd ? false : openSidebar;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 38
  });

  return (
    <Box>
      {/* <Box bgcolor={bgcolor} position={'relative'} zIndex={theme.zIndex.appBar}>
        <Container paddingTop={'8px !important'} paddingBottom={'0 !important'}>
          <TopNav colorInvert={colorInvert} />
        </Container>
      </Box> */}
      <AppBar
        position={'sticky'}
        sx={{
          top: 0,
          backgroundColor: trigger ? theme.palette.background.paper : bgcolor
        }}
        elevation={trigger ? 1 : 0}
      >
        <Container
          sx={{
            transition: 'all 0.5s ease'
          }}
          paddingY={trigger ? 1 : 2}
        >
          <Topbar onSidebarOpen={handleSidebarOpen} pages={pages} colorInvert={trigger ? false : colorInvert} />
        </Container>
      </AppBar>
      <Sidebar onClose={handleSidebarClose} open={open} variant="temporary" pages={pages} />
      <Box
        component="main"
        sx={{
          minHeight: {
            xs: 'calc(100vh - 340px)',
            sm: 'calc(100vh - 134px)',
            md: 'calc(100vh - 260px)'
          }
        }}
      >
        {children}
      </Box>
      <Divider />
      <Fab />
      <Container paddingY={4}>
        <Footer />
      </Container>
    </Box>
  );
};

export default Main;
