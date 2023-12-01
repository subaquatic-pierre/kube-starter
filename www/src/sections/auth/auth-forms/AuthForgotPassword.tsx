// next
import { useRouter } from 'next/router';

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

import useScriptRef from 'hooks/useScriptRef';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import axios from 'axios';
import { strapiReq } from 'lib/api';
import { forgotPassword, resetPassword } from 'lib/auth';

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

const AuthForgotPassword = () => {
  const scriptedRef = useScriptRef();
  const router = useRouter();

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Must be a valid email')
            .max(255)
            .required('Email is required'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const res = await forgotPassword({ email: values.email });

            console.log(res);

            setStatus({ success: true });
            setSubmitting(false);
            dispatch(
              openSnackbar({
                open: true,
                message: 'Check mail for reset password link',
                variant: 'alert',
                alert: {
                  color: 'success',
                },
                close: false,
              }),
            );
          } catch (err: any) {
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-forgot">Email Address</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-forgot"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-forgot">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>
                    {errors.submit as string}
                  </FormHelperText>
                </Grid>
              )}
              <Grid item xs={12} sx={{ mb: -2 }}>
                <Typography variant="caption">
                  If you haven't received the email, please check your Spam/Junk
                  folder.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Send Password Reset Email
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthForgotPassword;
