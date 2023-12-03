import React, { useEffect, useState } from 'react';

import {
  Box,
  FormHelperText,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox
} from '@mui/material';
// import {
//   GoogleReCaptchaProvider,
//   GoogleReCaptcha,
// } from 'react-google-recaptcha-v3';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import IconButton from 'components/@extended/IconButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// types
import { StringColorProps } from 'types/password';
import Link from 'next/link';
import useConfig from 'hooks/useConfig';
import getDictionary from 'locales';

// ============================|| AWS CONNITO - LOGIN ||============================ //

interface Props {
  formik: any;
  submitErrors: any;
  value: string;
}

const AuthRegister: React.FC<Props> = ({ formik, submitErrors, value }) => {
  const [change, setChange] = useState(0);
  const [captcha, setCaptcha] = useState<React.ReactElement | null>(null);
  const { errors, handleBlur, handleChange, touched, values } = formik;
  const [level, setLevel] = React.useState<StringColorProps>();
  const [showPassword, setShowPassword] = React.useState(false);
  const { i18n } = useConfig();
  const dict = getDictionary(i18n);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp, dict));
  };

  React.useEffect(() => {
    changePassword('');
  }, []);

  useEffect(() => {
    setChange((old) => old + 1);
  }, [value]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack spacing={1}>
          <Typography alignSelf={'center'}>{dict.usePersonalEmail}</Typography>
          <InputLabel htmlFor="email-login">{dict.emailAddress}</InputLabel>
          <OutlinedInput
            id="email-login"
            type="email"
            value={values.email}
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={dict.emailAddressPlaceholder}
            fullWidth
            error={Boolean((touched.email && errors.email) || !!submitErrors.email)}
          />
          {(touched.email && errors.email) ||
            (submitErrors && (
              <FormHelperText error id="standard-weight-helper-text-email-login">
                <>{errors.email ?? submitErrors.email}</>
              </FormHelperText>
            ))}
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1}>
          <InputLabel htmlFor="password-login">{dict.password}</InputLabel>
          <OutlinedInput
            fullWidth
            error={Boolean((touched.password && errors.password) || !!submitErrors.password)}
            id="password-login"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            name="password"
            onBlur={handleBlur}
            onChange={(e) => {
              handleChange(e);
              changePassword(e.target.value);
            }}
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
            placeholder={dict.passwordPlaceholder}
          />
          {(touched.password && errors.password) ||
            (submitErrors && (
              <FormHelperText error id="standard-weight-helper-text-password-login">
                <>{errors.password ?? submitErrors.password}</>
              </FormHelperText>
            ))}
        </Stack>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Box
                sx={{
                  bgcolor: level?.color,
                  width: 85,
                  height: 8,
                  borderRadius: '7px'
                }}
              />
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" fontSize="0.75rem">
                {level?.label}
              </Typography>
            </Grid>
          </Grid>
        </FormControl>
      </Grid>

      {/* <Grid item xs={12} sx={{ mt: -1 }}>
        <GoogleReCaptchaProvider reCaptchaKey="6Lcz7YkoAAAAAC4ziRXiavm_KnHaMpfZbyb3ozIf">
          <GoogleReCaptcha onVerify={() => {}} refreshReCaptcha={change} />
        </GoogleReCaptchaProvider>
      </Grid> */}
      {/* <Grid item xs={12} sx={{ mt: -1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
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
            label={
              <Typography variant="h6">I Agree to Terms of service</Typography>
            }
          />
          <Link href={'/terms-of-service'} passHref legacyBehavior>
            Terms of Service
          </Link>
        </Stack>
      </Grid> */}

      {submitErrors.submit && (
        <Grid item xs={12}>
          <FormHelperText error>
            <>{submitErrors.submit}</>
          </FormHelperText>
        </Grid>
      )}
    </Grid>
  );
};

export default AuthRegister;
