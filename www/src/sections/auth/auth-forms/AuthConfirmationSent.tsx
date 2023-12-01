import { useEffect, useState, SyntheticEvent } from 'react';

// next
import { useRouter } from 'next/router';

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import useScriptRef from 'hooks/useScriptRef';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// types
import { StringColorProps } from 'types/password';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import Link from 'next/link';

// ============================|| STATIC - RESET PASSWORD ||============================ //

const AuthResetPassword = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
        <AnimateButton>
          <Link href="/login">
            <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="primary">
              Back To Login
            </Button>
          </Link>
        </AnimateButton>
      </Grid>
    </Grid>
  );
};

export default AuthResetPassword;
