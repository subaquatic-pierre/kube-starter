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
import ProfileTab from './ProfileTab';
import { useRouter } from 'next/router';
import { UserProfile } from 'models/auth';
import { uploadFile } from 'lib/upload';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { UPDATE_PROFILE } from 'lib/endpoints';
import { strapiReqWithAuth } from 'lib/api';
import Image from 'next/image';
import useAuth from 'hooks/useAuth';
import { getStatusChipFromProfile } from 'utils/status';
import Loader from 'components/Loader';
import { updateProfile } from 'lib/profile';

// ==============================|| USER PROFILE - TAB CONTENT ||============================== //

interface Props {
  focusInput: () => void;
  profile: Partial<UserProfile>;
}

const ProfileTabs = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { profile } = useAuth();

  const theme = useTheme();
  const [firstLoad, setFirstLoad] = useState(true);

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
    if (profile) {
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
        // router.push(`/profile/personal`);
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
              {profile && profile.profilePic ? (
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
                    src={avatar}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSelectedImage(e.target.files?.[0])
              }
            />
            {profile && (
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="h5">
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography>{`${profile.user?.role.name ?? ''}`}</Typography>
              </Stack>
            )}
            <Box>{getStatusChipFromProfile(profile)}</Box>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <ProfileTab />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ProfileTabs;
