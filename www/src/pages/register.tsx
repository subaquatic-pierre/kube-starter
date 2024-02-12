import { ReactElement, useEffect, useState } from 'react';

// next
import NextLink from 'next/link';
import { NextPageContext } from 'next';

// material-ui
import { Button, Step, Stepper, StepLabel, Stack, Typography, Grid, Link, FormControlLabel, Checkbox, Box } from '@mui/material';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import LoginFormLayout from 'sections/auth/LoginFormLayout';
import AuthRegister from 'sections/auth/auth-forms/AuthRegister';
import AnimateButton from 'components/@extended/AnimateButton';
import CircularProgress from '@mui/material/CircularProgress';
import { register } from 'lib/auth';
import { useRouter } from 'next/router';

// third party
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import useConfig from 'hooks/useConfig';
import getDictionary from 'locales';

// ================================|| REGISTER ||================================ //

const Register = () => {
  const router = useRouter();
  const [visitorSpeaker, setVisitorSpeaker] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [submitErrors, setSubmitErrors] = useState<any>({});
  const { i18n } = useConfig();
  const dict = getDictionary(i18n);
  const [loading, setLoading] = useState(false);

  const validation = Yup.object().shape({
    email: Yup.string().email().max(255).required(),
    password: Yup.string().max(255).required()
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await validation.validate(values, {
        abortEarly: false
      });

      const registerData = {
        email: values.email,
        password: values.password
      };

      const res = await register(registerData);

      if (res.error) {
        setSubmitErrors({
          submit: 'There was an error submitting register form'
        });
      } else {
        const redirectPath = '/confirmation-sent';
        router.push(redirectPath);
      }
    } catch (e) {
      setSubmitErrors({
        email: e?.errors[0] ?? '',
        password: e?.errors[1] ?? ''
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: validation,
    onSubmit: () => {}
  });

  const handleNext = () => {
    handleSubmit(formik.values);
  };

  return (
    <Layout variant="blank">
      <Page title="Register">
        <LoginFormLayout>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                <Typography variant="h3">Register</Typography>
                <NextLink href="/login">{dict.alreadyHaveAccount}</NextLink>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <AuthRegister value={visitorSpeaker} formik={formik} submitErrors={submitErrors} />

              <Box>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <AnimateButton>
                    <Button variant="contained" onClick={handleNext} sx={{ mt: 3 }} fullWidth disabled={loading}>
                      Create Account
                    </Button>
                  </AnimateButton>
                )}
              </Box>
            </Grid>
          </Grid>
        </LoginFormLayout>
      </Page>
    </Layout>
  );
};
export default Register;
