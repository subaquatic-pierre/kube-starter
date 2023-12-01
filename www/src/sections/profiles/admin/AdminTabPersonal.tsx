import { useEffect, useRef, useState } from 'react';

// next
import Image from 'next/legacy/image';

// material-ui
import {
  Autocomplete,
  Box,
  Button,
  CardHeader,
  Chip,
  Divider,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import countries from 'data/countries';
import MainCard from 'components/MainCard';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { CloseOutlined } from '@ant-design/icons';

import SingleFileUpload from 'components/Dropzone';
import { CustomFile, DropzoneFileUpload, FormFiles } from 'types/dropzone';
import useAuth from 'hooks/useAuth';
import { getProfile, strapiReq, strapiReqWithAuth } from 'lib/api';
import {
  GET_USER,
  NEW_PROFILE,
  PROFILE,
  PROFILES,
  REGISTER,
  UPDATE_PROFILE,
  UPDATE_USER,
} from 'lib/endpoints';
import { AttendanceType, UserProfile } from 'models/auth';
import { DEFAULT_USER_PASSWORD, basePath } from 'utils/const';
import { useRouter } from 'next/router';
import { getNameOnCert } from 'lib/utils';
import { register } from 'lib/auth';
import DraftTextEditor from 'components/DraftTextEditor';
import { dummyEditorContent, getInitialFile } from './utils';
import { uploadFile, uploadFormFiles } from 'lib/upload';
import Loader from 'components/Loader';
import AttendanceRadios from '../user/AttendanceRadios';
import { updateProfile } from 'lib/profile';

// styles & constant
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

// ==============================|| TAB - PERSONAL ||============================== //

const emptyFiles: FormFiles = {
  idImage: {
    files: [],
    error: '',
  },
  passportPhoto: {
    files: [],
    error: '',
  },
};

const registerNewUser = async (
  values: any,
  visitorSpeaker: string,
): Promise<{ userId: string; profileId: string }> => {
  const newUserRes = await register({
    email: values.email ?? 'default@email.com',
    password: DEFAULT_USER_PASSWORD,
    speaker: visitorSpeaker === 'speakers' ? true : false,
  });

  const userId = `${newUserRes.data.user.id}`;

  if (newUserRes.error) {
    throw new Error(newUserRes.error.message);
  }

  const getUserRes = await strapiReqWithAuth<any>({
    endpoint: GET_USER(userId),
  });

  const profileId = getUserRes.data.profile.id;
  if (getUserRes.error) {
    throw new Error(newUserRes.error.message);
  }

  return { userId, profileId };
};

interface Props {
  profile: Partial<UserProfile>;
}

const defaultAttendanceValues: AttendanceType = {
  day1: null,
  day2: null,
  day3: null,
};

const AdminTabPersonal: React.FC<Props> = ({ profile }) => {
  const [attendanceError, setAttendanceError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialCodeImage, setDialCodeImage] = useState('');
  const [dialCode, setDialCode] = useState('');
  const [attendanceValues, setAttendanceValues] = useState(
    defaultAttendanceValues,
  );
  const router = useRouter();
  const { visitorSpeaker, profileId } = router.query;
  const isNewUser = profileId === 'new' || profileId === undefined;

  const [bioContent, setBioContent] = useState(
    profile.bio ?? dummyEditorContent,
  );
  const [files, setFiles] = useState<FormFiles>(emptyFiles);

  const loadInitialFiles = async (profile: Partial<UserProfile>) => {
    const images = { ...emptyFiles };

    if (profile.passportPhoto) {
      images.passportPhoto = await getInitialFile(
        profile.passportPhoto.filename,
        profile.passportPhoto.url,
      );
    }

    if (profile.idImage) {
      images.idImage = await getInitialFile(
        profile.idImage.filename,
        profile.idImage.url,
      );
    }

    setFiles(images);
  };

  const handleFileUpload = (field: string, value: any) => {
    setFiles((old) => ({ ...old, [field]: { files: value, error: '' } }));
  };

  useEffect(() => {
    loadInitialFiles(profile);
    if (profile.bio) {
      setBioContent(profile.bio);
    }
  }, [profile]);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const inputRef = useRef();

  const handleSubmit = async (
    values: any,
    { setErrors, setStatus, setSubmitting }: any,
  ) => {
    setLoading(true);

    delete values.submit;

    try {
      // throw error if attendance not set
      if (!files.idImage || files.idImage.files === null) {
        throw new Error('Please add ID image');
      }

      if (files.idImage.files.length === 0) {
        setFiles((old) => ({
          ...old,
          idImage: { files: [], error: 'Image image required' },
        }));
        throw new Error('Please add ID image');
      }
      Object.assign(values, {
        profileCompleted: true,
        bio: bioContent,
      });

      let newUserId = null;
      let newProfileId = null;

      // get dial code
      values.dialCode = dialCode;

      // append attendance types
      values.attendanceType = attendanceValues;

      // register new user if new profile
      if (isNewUser) {
        const { userId, profileId } = await registerNewUser(
          values,
          visitorSpeaker as string,
        );
        newUserId = userId;
        newProfileId = profileId;
      }

      // get new user profile id or get profileId from router
      const profileIdToUpdate =
        isNewUser && newProfileId ? newProfileId : profileId;

      const res = await uploadFormFiles(
        files,
        profileIdToUpdate,
        values.firstName,
        values.lastName,
      );

      Object.assign(values, {
        profileCompleted: true,
      });

      if (res && res.idImage) {
        Object.assign(values, {
          idImage: res.idImage,
        });
      }
      if (res && res.passportPhoto) {
        Object.assign(values, {
          passportPhoto: res.passportPhoto,
        });
      }

      // only update profile pic if one does not exist
      if (res && res.passportPhoto && !profile.profilePic) {
        Object.assign(values, {
          profilePic: res.passportPhoto,
        });
      }

      // update profile
      await updateProfile(values, profileIdToUpdate);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Personal profile updated successfully.',
          variant: 'alert',
          alert: {
            color: 'success',
          },
          close: false,
        }),
      );

      setStatus({ success: false });
      router.push(`/admin/${visitorSpeaker}/${profileIdToUpdate}/personal`);
    } catch (err: any) {
      dispatch(
        openSnackbar({
          open: true,
          message: `There was an error submitting your profile, please check errors`,
          variant: 'alert',
          alert: {
            color: 'error',
          },
          close: false,
        }),
      );

      setStatus({ success: false });
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (profile && profile.dialCode) {
      const nationality = countries.filter(
        (item) => item.phone === profile.dialCode,
      )[0];
      if (nationality) {
        const url = `https://flagcdn.com/w20/${nationality.code.toLowerCase()}.png`;
        setDialCodeImage(url);
      }
      setDialCode(profile.dialCode);
    }
  }, [profile]);

  if (loading) return <Loader />;

  return (
    <MainCard
      content={false}
      title={`Personal Information | Profile ID: ${profileId}`}
      sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
    >
      <Formik
        initialValues={{
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
          middleName: profile.middleName ?? '',
          title: profile.title ?? '',
          email: profile.email ?? '',
          degree: profile.degree ?? '',
          order: profile.order ?? '',
          nationality: profile.nationality ?? '',
          language: profile.language ?? '',
          contact: profile.contact ?? '',
          nameOnCert: getNameOnCert(profile),
          institution: profile.institution ?? '',
          country: profile.country ?? 'AE',
          submit: null,
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          firstName: Yup.string().max(255).required('First Name is required.'),
          nationality: Yup.string().max(255),
          language: Yup.string().max(255),
          middleName: Yup.string().max(255),
          degree: Yup.string().max(255),
          lastName: Yup.string().max(255).required('Last Name is required.'),
          nameOnCert: Yup.string()
            .max(40, 'Must be shorter than 40 characters')
            .matches(/^[a-zA-Z\., ]+$/, 'Name must  be in English only')
            .required('Name on Certification is required.'),
          email: Yup.string()
            .email('Invalid email address.')
            .max(255)
            .required('Email is required.'),
          contact: Yup.number().required('Phone number is required'),
          institution: Yup.string()
            .max(135, 'Must be shorter than 135 characters')
            .matches(/^[a-zA-Z\., ]+$/, 'Institution must be in English only')
            .required('Institution is required.'),
          country: Yup.string().required('Country is required'),
          order: Yup.number(),
        })}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          touched,
          values,
        }) => {
          return (
            <form noValidate onSubmit={handleSubmit}>
              <Box sx={{ p: 2.5 }}>
                <Grid container spacing={3}>
                  {/* First Name */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-first-name">
                        First Name
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="personal-first-name"
                        value={values.firstName}
                        name="firstName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="First Name"
                        inputRef={inputRef}
                      />
                      {touched.firstName && errors.firstName && (
                        <FormHelperText error id="personal-first-name-helper">
                          {errors.firstName as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Last Name */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-last-name">
                        Last Name
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="personal-last-name"
                        value={values.lastName}
                        name="lastName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Last Name"
                      />
                      {touched.lastName && errors.lastName && (
                        <FormHelperText error id="personal-last-name-helper">
                          {errors.lastName as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Middle Name */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-middle-name">
                        Middle Name
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="personal-last-name"
                        value={values.middleName}
                        name="middleName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Middle Name"
                      />
                      {touched.middleName && errors.middleName && (
                        <FormHelperText error id="personal-middle-name-helper">
                          {errors.middleName as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Title */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-title">Title</InputLabel>
                      <TextField
                        fullWidth
                        id="personal-title"
                        value={values.title}
                        name="title"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Mr / Mrs / Dr"
                      />
                      {touched.title && errors.title && (
                        <FormHelperText error id="personal-title-helper">
                          {errors.title as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Name on Cert */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-nameOnCert">
                        Name to show the official certificate and badge * (only
                        English names accepted)
                        <br />
                        اسمك في شهادة المشاركة سيتم طباعتها في الشهادة و تذكرة
                        الدخول (يتم قبول الأسماء الإنجليزية فقط)
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="personal-nameOnCert"
                        value={values.nameOnCert}
                        name="nameOnCert"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="This will be printed on the official certificate"
                      />
                      {touched.nameOnCert && errors.nameOnCert && (
                        <FormHelperText error id="personal-nameOnCert-helper">
                          {errors.nameOnCert as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Degree Input */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-degree">Degree</InputLabel>
                      <TextField
                        fullWidth
                        id="personal-degree"
                        value={values.degree}
                        name="degree"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Degree"
                      />
                      {touched.degree && errors.degree && (
                        <FormHelperText error id="personal-degree-helper">
                          {errors.degree as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Email Input */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-email">Email</InputLabel>
                      <TextField
                        type="email"
                        fullWidth
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        id="personal-email"
                        placeholder="Email Address"
                      />
                      {touched.email && errors.email && (
                        <FormHelperText error id="personal-email-helper">
                          {errors.email as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Institution Input */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-institution">
                        Institution * (shown on badge) <br /> جهة العمل (سيتم
                        طباعتها على تذكرة الدخول)
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="personal-institution"
                        value={values.institution}
                        name="institution"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Institution"
                      />
                      {touched.institution && errors.institution && (
                        <FormHelperText error id="personal-institution-helper">
                          {errors.institution as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Country Input */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-country">
                        Country
                      </InputLabel>
                      <Autocomplete
                        id="personal-country"
                        fullWidth
                        value={
                          countries.filter(
                            (item) => item.code === values?.country,
                          )[0] ?? { code: '', label: '', phone: '' }
                        }
                        onBlur={handleBlur}
                        onChange={(event, newValue) => {
                          setFieldValue(
                            'country',
                            newValue === null ? '' : newValue.code,
                          );
                        }}
                        options={countries}
                        autoHighlight
                        isOptionEqualToValue={(option, value) =>
                          option.code === value?.code
                        }
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            {option.code && (
                              <Image
                                loading="lazy"
                                width={21}
                                height={14}
                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                alt={option.code.toLowerCase()}
                              />
                            )}
                            <Typography sx={{ ml: option.code ? 1.25 : 0 }}>
                              {option.label} ({option.code}) +{option.phone}
                            </Typography>
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Choose a country"
                            name="country"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                          />
                        )}
                      />
                      {touched.country && errors.country && (
                        <FormHelperText error id="personal-country-helper">
                          {errors.country as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Contact Number Input */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-phone">
                        Phone Number
                      </InputLabel>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                      >
                        <Autocomplete
                          id="personal-dial-code"
                          disableClearable={true}
                          sx={{ width: '40%' }}
                          value={
                            countries.filter(
                              (item) => item.phone === dialCode,
                            )[0] ?? { code: '', label: '', phone: '' }
                          }
                          onBlur={handleBlur}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setDialCodeImage(
                                `https://flagcdn.com/w20/${newValue.code.toLowerCase()}.png`,
                              );
                            }
                            setDialCode(newValue.phone);
                          }}
                          options={countries}
                          autoHighlight
                          isOptionEqualToValue={(option, value) =>
                            option.phone === value?.phone
                          }
                          getOptionLabel={(option) => option.phone}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              {option.code && (
                                <Image
                                  loading="lazy"
                                  width={21}
                                  height={14}
                                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                  alt={option.code.toLowerCase()}
                                />
                              )}
                              <Typography sx={{ ml: option.code ? 1.25 : 0 }}>
                                {option.phone}
                              </Typography>
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Dial Code"
                              name="dialCode"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                        <TextField
                          fullWidth
                          id="personal-contact"
                          value={values.contact}
                          name="contact"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Contact Number"
                        />
                      </Stack>
                      {touched.contact && errors.contact && (
                        <FormHelperText error id="personal-contact-helper">
                          {errors.contact ? (errors.contact as string) : ''}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Nationality Input */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-nationality">
                        Nationality
                      </InputLabel>
                      <Autocomplete
                        id="personal-nationality"
                        fullWidth
                        value={
                          countries.filter(
                            (item) => item.code === values?.nationality,
                          )[0] ?? { code: '', label: '', phone: '' }
                        }
                        onBlur={handleBlur}
                        onChange={(event, newValue) => {
                          setFieldValue(
                            'nationality',
                            newValue === null ? '' : newValue.code,
                          );
                        }}
                        options={countries}
                        autoHighlight
                        isOptionEqualToValue={(option, value) =>
                          option.code === value?.code
                        }
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            {option.code && (
                              <Image
                                loading="lazy"
                                width={21}
                                height={14}
                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                alt={option.code.toLowerCase()}
                              />
                            )}
                            <Typography sx={{ ml: option.code ? 1.25 : 0 }}>
                              {option.label} ({option.code}) +{option.phone}
                            </Typography>
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Choose a nationality"
                            name="nationality"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                          />
                        )}
                      />
                      {touched.nationality && errors.nationality && (
                        <FormHelperText error id="personal-nationality-helper">
                          {errors.nationality as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Language Input */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-language">
                        Language
                      </InputLabel>
                      <Select
                        fullWidth
                        id="personal-language"
                        value={values.language}
                        name="language"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Language"
                      >
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Arabic">Arabic</MenuItem>
                      </Select>
                      {touched.language && errors.language && (
                        <FormHelperText error id="personal-language-helper">
                          {errors.language as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Order */}
                  {profile && profile.user?.role?.type === 'speaker' && (
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-order">Order</InputLabel>
                        <TextField
                          fullWidth
                          id="personal-order"
                          value={values.order}
                          name="order"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Order"
                        />
                        {touched.order && errors.order && (
                          <FormHelperText error id="personal-order-helper">
                            {errors.order as string}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                  )}
                </Grid>
              </Box>

              <CardHeader title="User ID" />
              <Divider />
              <Box sx={{ p: 2.5 }}>
                <Grid container spacing={3}>
                  {/* User Id Input */}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-id-doc">
                        ID Document
                      </InputLabel>
                      <SingleFileUpload
                        id="idImage"
                        noRemove
                        setFieldValue={handleFileUpload}
                        title="Upload User ID or Passport Picture"
                        file={files.idImage.files}
                        error={!!files.idImage.error}
                      />
                      {files.idImage && files.idImage.error && (
                        <FormHelperText error id="personal-id-doc-helper-text">
                          {files.idImage.error as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="personal-passport-photo">
                        Offical Personal Photo
                      </InputLabel>
                      <SingleFileUpload
                        noRemove
                        id="passportPhoto"
                        setFieldValue={handleFileUpload}
                        title="Upload Photo for Visa application"
                        file={files.passportPhoto.files}
                        error={!!files.passportPhoto.error}
                      />
                      {files.passportPhoto && files.passportPhoto.error && (
                        <FormHelperText
                          error
                          id="personal-passport-photo-helper-text"
                        >
                          {files.passportPhoto.error as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>

              {/* Bio input */}
              {((profile && profile.user?.role?.type === 'speaker') ||
                (isNewUser && visitorSpeaker !== 'visitors')) && (
                <>
                  <CardHeader title="Speaker Bio" />
                  <Divider />
                  <Box sx={{ p: 2.5 }}>
                    <Grid item xs={12}>
                      <DraftTextEditor
                        content={bioContent}
                        setContent={setBioContent}
                      />
                    </Grid>
                  </Box>
                </>
              )}

              {/* Day attendance rows */}
              {/* {profile.user?.role?.type === 'visitor' && ( */}
              <>
                <CardHeader title="Attendance Type" />
                <Divider />
                <Box sx={{ p: 2.5 }}>
                  <AttendanceRadios
                    attendanceError={attendanceError}
                    setAttendanceValues={setAttendanceValues}
                    profileProp={profile}
                  />
                </Box>
              </>
              {/* )} */}

              {/* Submit Buttons */}
              <Box sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                  sx={{ mt: 2.5 }}
                >
                  <Button variant="outlined" color="secondary">
                    Cancel
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                  >
                    Save
                  </Button>
                </Stack>
              </Box>
            </form>
          );
        }}
      </Formik>
    </MainCard>
  );
};

export default AdminTabPersonal;
