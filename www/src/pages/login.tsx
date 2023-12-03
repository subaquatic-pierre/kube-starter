// next
import { NextPageContext } from 'next';
import NextLink from 'next/link';

// material-ui
import { Grid, Link, Stack, Typography } from '@mui/material';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import LoginFormLayout from 'sections/auth/LoginFormLayout';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';
import { useEffect } from 'react';

export default function SignIn() {
  return (
    <Layout variant="blank">
      <Page title="Login">
        <LoginFormLayout>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                sx={{ mb: { xs: -0.5, sm: 0.5 } }}
              >
                <Typography variant="h3">Login</Typography>
                <NextLink href="/register" passHref legacyBehavior>
                  <Link variant="body1" color="primary">
                    Don&apos;t have an account?
                  </Link>
                </NextLink>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <AuthLogin />
            </Grid>
          </Grid>
        </LoginFormLayout>
      </Page>
    </Layout>
  );
}
