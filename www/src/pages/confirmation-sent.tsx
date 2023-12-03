// next
import NextLink from 'next/link';

// material-ui
import { Grid, Link, Stack, Typography } from '@mui/material';

import Layout from 'layout';
import Page from 'components/Page';
import LoginFormLayout from 'sections/auth/LoginFormLayout';
import AuthConfirmationSent from 'sections/auth/auth-forms/AuthConfirmationSent';

// ================================|| FORGOT PASSWORD ||================================ //

const ResetPassword = () => (
  <Layout variant="blank">
    <Page title="Confirmation">
      <LoginFormLayout>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
              sx={{ mb: { xs: -0.5, sm: 0.5 } }}
            >
              <Typography variant="h3">Confirmation Sent</Typography>
              <NextLink href="/login" passHref legacyBehavior>
                <Link variant="body1" color="primary">
                  Back to Login
                </Link>
              </NextLink>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography paragraph>
              A confirmation email has been sent to your email address. Please
              check your inbox for the confirmation link.         
            </Typography>
            <Typography paragraph sx={{color: 'red'}}>
              <b>Didn't receive the confirmation email? Check your Spam/Junk folder and move it to your inbox to ensure future updates</b>
            </Typography>
             <Typography paragraph dir={'rtl'} sx={{color: 'red'}}>
             <b>لم تتلق رسالة التأكيد عبر البريد الإلكتروني؟ تحقق من مجلد البريد المزعج / الرسائل غير المرغوب فيها وانقله إلى صندوق الوارد الخاص بك لضمان التحديثات المستقبلية</b>
            </Typography>
            <Typography>
              Once you click the link you will be redirected to the login page
              where you can login to your newly confirmed account.
            </Typography>
            <AuthConfirmationSent />
          </Grid>
        </Grid>
      </LoginFormLayout>
    </Page>
  </Layout>
);

export default ResetPassword;
