import React, { useEffect, useState, ChangeEvent } from 'react';

// next
import NextLink from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Divider,
  FormLabel,
  Grid,
  Chip,
  TextField,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { facebookColor, linkedInColor, twitterColor } from 'config';

// types
import { ThemeMode } from 'types/config';

// assets
import {
  FacebookFilled,
  LinkedinFilled,
  MoreOutlined,
  TwitterSquareFilled,
  CameraOutlined,
} from '@ant-design/icons';
import AdminProfileTab from './AdminProfileTab';
import { useRouter } from 'next/router';
import { UserProfile } from 'models/auth';
import { uploadFile } from 'lib/upload';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { UPDATE_PROFILE } from 'lib/endpoints';
import { strapiReqWithAuth } from 'lib/api';
import Image from 'next/image';
import { getStatusChipFromProfile } from 'utils/status';
import Loader from 'components/Loader';
import { updateProfile } from 'lib/profile';

// ==============================|| USER PROFILE - TAB CONTENT ||============================== //

interface Props {
  focusInput: () => void;
  profile: Partial<UserProfile>;
}

const AdminProfileTabs = ({ focusInput, profile }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { visitorSpeaker, profileId } = router.query;
  const theme = useTheme();
  const [firstLoad, setFirstLoad] = useState(true);

  const isNewUser = profileId === 'new' || profileId === undefined;

  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined,
  );
  const [avatar, setAvatar] = useState<string | undefined>(
    profile && profile.profilePic ? profile.profilePic.url : '',
  );

  useEffect(() => {
    if (profile && profile.profilePic && profile.profilePic.url) {
      setAvatar(profile.profilePic.url);
    }
  }, [profile]);

  const handleSaveProfilePic = async () => {
    setLoading(true);
    if (profile && !isNewUser) {
      try {
        const etx = selectedImage.name.split('.')[1];
        const filename = `${profile.firstName}-${profile.lastName}-profilePic.${
          etx ?? 'jpg'
        }`;

        const uploadRes = await uploadFile(
          filename,
          `${profile.id}`,
          selectedImage,
        );

        if (uploadRes.error) {
          throw new Error(uploadRes.error.message);
        }

        const updateValues = {
          profilePic: {
            filename: filename,
            url: uploadRes.data.url,
          },
        };

        const updateProfileRes = await updateProfile(
          updateValues,
          `${profile.id}`,
        );

        if (updateProfileRes.error) {
          throw new Error(updateProfileRes.error.message);
        }

        // return updateProfileRes;
        dispatch(
          openSnackbar({
            open: true,
            message: 'Profile picture updated successfully.',
            variant: 'alert',
            alert: {
              color: 'success',
            },
            close: false,
          }),
        );
      } catch (e: any) {
        console.log(e);

        dispatch(
          openSnackbar({
            open: true,
            message: `There was an error updating profile pic`,
            variant: 'alert',
            alert: {
              color: 'error',
            },
            close: false,
          }),
        );
      } finally {
        setLoading(false);
        // router.push(`/admin/${visitorSpeaker}/${profileId}/profile`);
      }
    }
  };

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
      if (!firstLoad) {
        handleSaveProfilePic();
      }
    }
  }, [selectedImage, profile, router.asPath]);

  useEffect(() => {
    setFirstLoad(false);
  }, []);

  if (loading) return <Loader />;

  return (
    <MainCard>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {isNewUser ? (
            <Stack spacing={2.5} alignItems="center">
              <Avatar
                alt={profile.firstName}
                sx={{ width: 124, height: 124, border: '1px dashed' }}
              />
            </Stack>
          ) : (
            <Stack spacing={2.5} alignItems="center">
              <FormLabel
                htmlFor="change-avtar"
                sx={{
                  position: 'relative',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  '&:hover .MuiBox-root': { opacity: 1 },
                  cursor: 'pointer',
                }}
              >
                {profile && profile.profilePic && profile.profilePic.url ? (
                  <Box
                    position="relative"
                    sx={{
                      height: 130,
                      width: 130,
                      border: '1px dashed',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      sizes={'sm'}
                      alt="image"
                      fill
                      style={{ overflow: 'hidden', objectFit: 'cover' }}
                      src={profile.profilePic.url}
                    />
                  </Box>
                ) : (
                  <Avatar
                    alt={profile.firstName}
                    sx={{ width: 124, height: 124, border: '1px dashed' }}
                  />
                )}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor:
                      theme.palette.mode === ThemeMode.DARK
                        ? 'rgba(255, 255, 255, .75)'
                        : 'rgba(0,0,0,.65)',
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Stack spacing={0.5} alignItems="center">
                    <CameraOutlined
                      style={{
                        color: theme.palette.secondary.lighter,
                        fontSize: '2rem',
                      }}
                    />
                    <Typography sx={{ color: 'secondary.lighter' }}>
                      Upload
                    </Typography>
                  </Stack>
                </Box>
              </FormLabel>
              <TextField
                type="file"
                id="change-avtar"
                placeholder="Outlined"
                variant="outlined"
                sx={{ display: 'none' }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSelectedImage(e.target.files?.[0]);
                }}
              />
              {profileId !== 'new' && profile && (
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">
                    {profile.firstName} {profile.lastName}
                  </Typography>
                  <Typography>{`${
                    profile.user?.role.name ?? 'Visitor'
                  }`}</Typography>
                </Stack>
              )}
              <Box>{getStatusChipFromProfile(profile)}</Box>
            </Stack>
          )}
        </Grid>
        <Grid item xs={12}>
          <AdminProfileTab profile={profile} />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default AdminProfileTabs;
