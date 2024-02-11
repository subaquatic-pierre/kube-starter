import React from 'react';

// next
import Image from 'next/legacy/image';

import NextLink from 'next/link';

// material-ui
import { Theme } from '@mui/material/styles';
import {
  Box,
  useMediaQuery,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  CircularProgress
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import { APP_ADMIN_DEFAULT_PATH } from 'config';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { login } from 'lib/auth';
import { parseToken, setTokenInStorage } from 'utils/jwt';
import { useRouter } from 'next/router';
import useAuth from 'hooks/useAuth';

// ============================|| AWS CONNITO - LOGIN ||============================ //

const AuthLogin = () => {
  const { setLoading, loading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);
  const [capsWarning, setCapsWarning] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  const onKeyDown = (keyEvent: any) => {
    if (keyEvent.getModifierState('CapsLock')) {
      setCapsWarning(true);
    } else {
      setCapsWarning(false);
    }
  };

  const handleSubmit = async (values: any, { setErrors, setSubmitting }: any): Promise<any> => {
    const res = await login({
      email: values.email,
      password: values.password
    });

    if (res.error) {
      setErrors({ submit: res.error.message });
      setSubmitting(false);
      setTokenInStorage(null);
    } else {
      if (res.data?.token) {
        setLoading(true);
        const token = parseToken(res.data.token);
        setTokenInStorage(token);
      }
      setSubmitting(false);

      router.push({ pathname: APP_ADMIN_DEFAULT_PATH, query: router.query });
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email as string}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    color={capsWarning ? 'warning' : 'primary'}
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={(event: React.FocusEvent<any, Element>) => {
                      setCapsWarning(false);
                      handleBlur(event);
                    }}
                    onKeyDown={onKeyDown}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {capsWarning && (
                    <Typography variant="caption" sx={{ color: 'warning.main' }} id="warning-helper-text-password-login">
                      Caps lock on!
                    </Typography>
                  )}
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password as string}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me sign in</Typography>}
                  />
                  <NextLink href={'/forgot-password'} passHref legacyBehavior>
                    <Link variant="h6" color="text.primary">
                      Forgot Password?
                    </Link>
                  </NextLink>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit as string}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                {loading ? (
                  <CircularProgress />
                ) : (
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
                      Login
                    </Button>
                  </AnimateButton>
                )}
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
