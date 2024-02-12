// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Button, Container, CardMedia, Divider, Grid, Link, Stack, Typography, LinkProps } from '@mui/material';

// third party
import { motion } from 'framer-motion';

// project import
import useConfig from 'hooks/useConfig';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { GithubFilled, LinkedinFilled, LinkedinOutlined, SendOutlined } from '@ant-design/icons';

// types
import { ThemeDirection, ThemeMode } from 'types/config';
import { PropsWithChildren } from 'react';

const imgfooterlogo = 'assets/images/landing/codedthemes-logo.svg';
const imgfootersoc1 = 'assets/images/landing/img-soc1.svg';
const imgfootersoc2 = 'assets/images/landing/img-soc2.svg';
const imgfootersoc3 = 'assets/images/landing/img-soc3.svg';

// link - custom style
const FooterLink: React.FC<PropsWithChildren & LinkProps> = ({ children, ...props }) => {
  return (
    <Box
      sx={(theme) => ({
        color: theme.palette.text.secondary,
        '&:hover': {
          color: theme.palette.primary.main
        },
        '&:active': {
          color: theme.palette.primary.main
        }
      })}
      component={Link}
      {...props}
    >
      {children}
    </Box>
  );
};

// ==============================|| LANDING - FOOTER PAGE ||============================== //

type showProps = {
  isFull?: boolean;
};

const FooterBlock = ({ isFull }: showProps) => {
  const theme = useTheme();
  const { presetColor } = useConfig();
  const textColor = theme.palette.mode === ThemeMode.DARK ? 'text.primary' : 'background.paper';

  const linkSX = {
    color: theme.palette.common.white,
    fontSize: '0.875rem',
    fontWeight: 400,
    opacity: '0.6',
    cursor: 'pointer',
    '&:hover': {
      opacity: '1'
    }
  };

  return (
    <Box
      sx={{
        py: 4
        // bgcolor: theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700]
      }}
    >
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Typography>Nebula Nexus - Unleashing Innovation in the Cloud</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container spacing={2} alignItems="center" sx={{ justifyContent: 'flex-end' }}>
              <Grid item>
                <Link underline="none" href="https://www.linkedin.com/in/subaquatic-pierre/" target="_blank" sx={linkSX}>
                  <LinkedinFilled style={{ fontSize: '200%' }} />
                </Link>
              </Grid>
              <Grid item>
                <Link underline="none" href="https://github.com/subaquatic-pierre" target="_blank" sx={linkSX}>
                  <GithubFilled style={{ fontSize: '200%' }} />
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FooterBlock;
