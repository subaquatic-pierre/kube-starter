// next
import NextLink from 'next/link';
import Image from 'next/legacy/image';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Container, Grid, Link, Typography } from '@mui/material';

// third party
import { motion } from 'framer-motion';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined } from '@ant-design/icons';

const headertechimg = '/assets/images/landing/img-headertech.svg';

// ==============================|| LANDING - HEADER PAGE ||============================== //

const HeaderPage = () => {
  const theme = useTheme();

  return (
    <Container sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container alignItems="center" justifyContent="space-between" spacing={2} sx={{ pt: { md: 0, xs: 8 }, pb: { md: 0, xs: 5 } }}>
        <Grid item xs={12} lg={5} md={6}>
          <Grid container spacing={2} sx={{ pr: 10, [theme.breakpoints.down('md')]: { pr: 0, textAlign: 'center' } }}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30
                }}
              >
                <Typography
                  variant="h1"
                  color="white"
                  sx={{
                    fontSize: { xs: '1.825rem', sm: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    lineHeight: { xs: 1.3, sm: 1.3, md: 1.3 }
                  }}
                >
                  Igniting the Future of Software Engineering
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.2
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  color="white"
                  sx={{
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    fontWeight: 400,
                    lineHeight: { xs: 1.4, md: 1.4 }
                  }}
                >
                  Unleash Innovation in the Cosmos of Code with Cutting-Edge Cloud Solutions. Your Journey to Limitless Possibilities Begins
                  Here.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} sx={{ my: 3.25 }}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.4
                }}
              >
                <Grid container spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Grid item>
                    <AnimateButton>
                      <Button
                        component={NextLink}
                        href="/login"
                        size="large"
                        color="primary"
                        variant="contained"
                        startIcon={<EyeOutlined style={{ fontSize: '1.15rem' }} />}
                      >
                        Login
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={7} md={6} sx={{ display: { xs: 'none', md: 'flex' } }} />
      </Grid>
    </Container>
  );
};

export default HeaderPage;
