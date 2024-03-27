import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useSettings from 'hooks/useSettings';
import { Stack } from '@mui/material';

const Footer = (): JSX.Element => {
  const settings = useSettings();
  const theme = useTheme();
  const { mode } = theme.palette;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={1} flexDirection={{ xs: 'column', sm: 'row' }}>
          <Box display={'flex'} component={Link} href="/" title={settings.title} height={{ xs: 60, md: 80 }} width={{ xs: 60, md: 100 }}>
            {/* TODO: Get logo from CMS */}
            <Box
              sx={{
                objectFit: 'contain',
                ...(mode === 'dark' && {
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
          {/* <Box display="flex" flexWrap={'wrap'} alignItems={'center'}>
            <Box marginTop={1} marginRight={2}>
              <Link underline="none" component="a" href="/" color="text.primary" variant={'subtitle2'}>
                Home
              </Link>
            </Box>
            <Box marginTop={1} marginRight={2}>
              <Link
                underline="none"
                component="a"
                href="https://thefront.maccarianagency.com/docs/introduction"
                target={'blank'}
                color="text.primary"
                variant={'subtitle2'}
              >
                Documentation
              </Link>
            </Box>
            <Box marginTop={1}>
              <Button
                variant="outlined"
                color="primary"
                component="a"
                target="blank"
                href="https://mui.com/store/items/the-front-landing-page/"
                size="small"
              >
                Purchase now
              </Button>
            </Box>
          </Box> */}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Typography maxWidth={800} align={'center'} variant={'caption'} color="text.secondary" component={'p'}>
            When you visit or interact with our sites, services or tools, we or our authorised service providers may use cookies for storing
            information to help provide you with a better, faster and safer experience and for marketing purposes.
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Footer;
