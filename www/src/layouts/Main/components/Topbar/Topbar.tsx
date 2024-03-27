import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { alpha, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

import { NavItem } from './components';
import ThemeModeToggler from 'components/ThemeModeToggler';
import Link from 'next/link';
import { Stack, useScrollTrigger } from '@mui/material';
import useSettings from 'hooks/useSettings';
import { apiReq } from 'lib/api';
// import { LIST_PAGES } from 'lib/endpoints';
// import { reducePages } from 'models/page';

interface Props {
  // eslint-disable-next-line @typescript-eslint/ban-types
  onSidebarOpen: () => void;
  pages?: {
    landings: Array<PageItem>;
    company: Array<PageItem>;
    account: Array<PageItem>;
    secondary: Array<PageItem>;
    blog: Array<PageItem>;
    portfolio: Array<PageItem>;
  };
  colorInvert?: boolean;
}

const Topbar = ({ onSidebarOpen, pages, colorInvert = false }: Props): JSX.Element => {
  const [pagesState, setPagesState] = useState([
    {
      title: 'Agency',
      href: '/agency'
    },
    {
      title: 'Design Company',
      href: '/design-company'
    },
    {
      title: 'Expo',
      href: '/expo'
    }
  ]);
  const settings = useSettings();
  const theme = useTheme();
  const { mode } = theme.palette;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 60
  });

  // const loadPages = async () => {
  //   try {
  //     const pagesRes = await apiReq<{ data: any }>({ endpoint: LIST_PAGES() });
  //     const pages = reducePages(pagesRes);
  //     const pageItems = pages.map((page) => ({ title: page.title, href: `/${page.slug}` }));
  //     setPagesState(pageItems);
  //   } catch {}
  // };

  useEffect(() => {
    // loadPages();
  }, []);

  return (
    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={1}>
      <Box
        display={'flex'}
        component={Link}
        href="/"
        title={settings.title}
        sx={{
          transition: '0.5s ease',
          ...(trigger
            ? {
                height: { xs: 20, md: 60 },
                width: { xs: 40, md: 80 }
              }
            : {
                height: { xs: 60, md: 70 },
                width: { xs: 60, md: 100 }
              })
        }}
      >
        {/* TODO: Get logo from CMS */}
        <Box
          sx={{
            objectFit: 'contain',
            ...(mode === 'dark' &&
              !colorInvert && {
                WebkitFilter: 'brightness(0) invert(1)',
                filter: 'brightness(0) invert(1)'
              })
          }}
          component={'img'}
          src={settings.logo}
          height={1}
          width={1}
        />
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' } }} alignItems={'center'}>
        <Stack spacing={2} direction="row">
          <NavItem title={'About Us'} path="/about-us" id={'about-us'} colorInvert={colorInvert} />
          <NavItem title={'Services'} path="/services" id={'services'} colorInvert={colorInvert} />
          <NavItem title={'Contact Us'} path="/contact-us" id={'contact'} colorInvert={colorInvert} />
          <NavItem title={'Blog'} path="/blog" id={'blog'} colorInvert={colorInvert} />
          <NavItem title={'Demo Pages'} id={'pages'} items={pagesState} colorInvert={colorInvert} />
        </Stack>
        <Box marginLeft={4} marginRight={2}>
          <Button variant="contained" color="primary" href="/admin" LinkComponent={Link} size="large">
            Login
          </Button>
        </Box>
        <Box>
          <ThemeModeToggler />
        </Box>
      </Box>
      <Box sx={{ display: { xs: 'flex', md: 'none' } }} alignItems={'center'}>
        <Button
          onClick={() => onSidebarOpen()}
          aria-label="Menu"
          variant={'outlined'}
          sx={{
            borderRadius: 2,
            minWidth: 'auto',
            padding: 1,
            borderColor: alpha(theme.palette.divider, 0.2)
          }}
        >
          <MenuIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default Topbar;
