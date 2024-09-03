import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useSettings from 'hooks/useSettings';

import NavItem from './components/NavItem';
import LinkNavItem from 'layouts/Main/components/Topbar/components/NavItem';
import { Stack } from '@mui/material';
import Link from 'next/link';

interface Props {
  pages: {
    landings: Array<PageItem>;
    company: Array<PageItem>;
    account: Array<PageItem>;
    secondary: Array<PageItem>;
    blog: Array<PageItem>;
    portfolio: Array<PageItem>;
  };
}

const SidebarNav = ({ pages }: Props): JSX.Element => {
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

  const {
    landings: landingPages,
    secondary: secondaryPages,
    company: companyPages,
    account: accountPages,
    portfolio: portfolioPages,
    blog: blogPages
  } = pages;

  return (
    <Box>
      <Box
        display={'flex'}
        component={Link}
        href="/"
        title={settings.title}
        sx={{
          flexDirection: 'row',
          transition: '0.5s ease',
          height: { xs: 60, md: 70 },
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* TODO: Get logo from CMS */}
        <Box
          sx={{
            maxWidth: '100px',
            objectFit: 'contain',
            ...(mode === 'dark' && {
              WebkitFilter: 'brightness(0) invert(1)',
              filter: 'brightness(0) invert(1)'
            })
          }}
          component={'img'}
          src={settings.logo}
          height={1}
        />
      </Box>

      <Box paddingX={2} paddingY={2}>
        <Stack spacing={2}>
          <LinkNavItem title={'About Us'} path="/about-us" id={'about-us'} />
          <LinkNavItem title={'Services'} path="/services" id={'services'} />
          <LinkNavItem title={'Contact Us'} path="/contact-us" id={'contact'} />
          <LinkNavItem title={'Blog'} path="/blog" id={'blog'} />
          <NavItem title={'Demo Pages'} id={'pages'} items={pagesState} />
        </Stack>
        {/* <Box>
          <NavItem title={'Landings'} items={landingPages} />
        </Box>
        <Box>
          <NavItem title={'Company'} items={companyPages} />
        </Box>
        <Box>
          <NavItem title={'Pages'} items={secondaryPages} />
        </Box>
        <Box>
          <NavItem title={'Account'} items={accountPages} />
        </Box>
        <Box>
          <NavItem title={'Blog'} items={blogPages} />
        </Box>
        <Box>
          <NavItem title={'Portfolio'} items={portfolioPages} />
        </Box>
        <Box marginTop={2}>
          <Button
            size={'large'}
            variant="outlined"
            fullWidth
            component="a"
            href="https://thefront.maccarianagency.com/docs/introduction"
            target={'blank'}
          >
            Documentation
          </Button>
        </Box>
        <Box marginTop={1}>
          <Button
            size={'large'}
            variant="contained"
            color="primary"
            fullWidth
            component="a"
            target="blank"
            href="https://mui.com/store/items/the-front-landing-page/"
          >
            Purchase now
          </Button>
        </Box> */}
      </Box>
    </Box>
  );
};

export default SidebarNav;
