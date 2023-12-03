import { ReactElement, useEffect, useState } from 'react';

// next
import NextLink from 'next/link';
import { NextPageContext } from 'next';

// material-ui
import { Button, Step, Stepper, StepLabel, Stack, Typography, Grid, Link, FormControlLabel, Checkbox } from '@mui/material';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import LoginFormLayout from 'sections/auth/LoginFormLayout';
import AuthRegister from 'sections/auth/auth-forms/AuthRegister';
import AuthVisitorSpeaker from 'sections/auth/auth-forms/AuthVisitorSpeaker';
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
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const validation = Yup.object().shape({
    email: Yup.string().email(dict.emailValidation1).max(255).required(dict.emailValidation2),
    password: Yup.string().max(255).required(dict.passwordValidation)
  });

  const toggleVisitorSpeakerChange = (value: string) => {
    if (value) {
      setVisitorSpeaker(value);
      setSelectedLabel(value === 'visitor' ? `${dict.visitor}` : `${dict.speaker}`);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await validation.validate(values, {
        abortEarly: false
      });

      const registerData = {
        email: values.email,
        password: values.password,
        speaker: visitorSpeaker === 'visitor' ? false : true
      };

      const res = await register(registerData);
      // const res = { error: { message: 'There was an error submitting form' } };

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
        email: e.errors[0] ?? '',
        password: e.errors[1] ?? ''
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
    if (activeStep === 1) {
      handleSubmit(formik.values);
    } else {
      setActiveStep(activeStep + 1);
      setSelectedLabel(visitorSpeaker === 'visitor' ? 'Visitor' : 'Speaker');
    }
  };

  useEffect(() => {
    if (visitorSpeaker) {
      setActiveStep(1);
    }
  }, [visitorSpeaker]);

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <AuthVisitorSpeaker handleChange={toggleVisitorSpeakerChange} value={visitorSpeaker} />;
      case 1:
        return <AuthRegister value={visitorSpeaker} formik={formik} submitErrors={submitErrors} />;
      default:
        throw new Error('Unknown step');
    }
  }

  return (
    <Layout variant="blank">
      <Page title="Register">
        <LoginFormLayout>
          <Typography variant="h4" align="center" mb={1}>
            {dict.registerVideoTitle}
          </Typography>
          <Typography variant="subtitle1" align="center" mb={2}>
            {dict.registerVideoText}
          </Typography>
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                <Typography variant="h3">{dict.register}</Typography>
                <NextLink href="/login" passHref legacyBehavior>
                  <Link variant="body1" color="primary">
                    {dict.alreadyHaveAccount}
                  </Link>
                </NextLink>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                <Step key={0}>
                  <StepLabel>{selectedLabel === '' ? dict.selectStatus : selectedLabel}</StepLabel>
                </Step>
                <Step key={1}>
                  <StepLabel>{dict.createAccount}</StepLabel>
                </Step>
              </Stepper>
              <>
                {getStepContent(activeStep)}
                <Stack direction="row" justifyContent={activeStep !== 0 ? 'space-between' : 'flex-end'}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
                      {dict.back}
                    </Button>
                  )}
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    activeStep === 1 && (
                      <AnimateButton>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ my: 3, ml: 1 }}
                          fullWidth
                          disabled={activeStep > 0 && !!Object.values(formik.errors).some((val) => val !== '')}
                        >
                          {activeStep === 1 ? `${dict.createAccount}` : 'Next'}
                        </Button>
                      </AnimateButton>
                    )
                  )}
                </Stack>
              </>
            </Grid>
          </Grid>
        </LoginFormLayout>
      </Page>
    </Layout>
  );
};
export default Register;
