import { useEffect, useState } from 'react';

// material-ui
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Typography,
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import {
  FileDoneOutlined,
  LockOutlined,
  MailOutlined,
  TranslationOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { UserProfile } from 'models/auth';
import { useRouter } from 'next/router';
import { UPDATE_PROFILE, UPDATE_USER } from 'lib/endpoints';
import { strapiReqWithAuth } from 'lib/api';
import Loader from 'components/Loader';
import { updateProfile } from 'lib/profile';

const getStatusFromProfile = (profile: Partial<UserProfile>) => {
  const status = [];

  if (profile.user?.role?.type === 'speaker') {
    status.push('speaker');
  }

  if (profile.attendanceConfirmed) {
    status.push('confirmed');
  }

  if (profile.user.blocked) {
    status.push('blocked');
  }

  if (profile.rejected) {
    status.push('rejected');
  }

  return status;
};

const updateUser = async (userId: string, checked: string[]) => {
  const userRole = checked.indexOf('speaker') < 0 ? 3 : 5;
  const blocked = checked.indexOf('blocked') < 0 ? false : true;

  // handle submit
  const updateUserRoleRes = await strapiReqWithAuth<any>({
    endpoint: UPDATE_USER(userId),
    method: 'PUT',
    data: { role: userRole, blocked: blocked },
  });

  if (updateUserRoleRes.error) {
    throw new Error(updateUserRoleRes.error.message);
  }
};

interface Props {
  profile: Partial<UserProfile>;
}

const AdminTabSettings: React.FC<Props> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { visitorSpeaker, profileId } = router.query;
  const isNewUser = profileId === 'new' || profileId === undefined;

  const [status, setStatus] = useState({ error: '', loading: false });

  // Checked settings for profile status
  const [checked, setChecked] = useState(getStatusFromProfile(profile));

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    // get all indexes of values
    const confirmStatusIndex = checked.indexOf('confirmed');

    if (currentIndex === -1) {
      // both next checks handle case where blocked or rejected value set
      // remove confirmed in either case

      // remove confirmed status if blocked
      if (value === 'blocked' || value === 'rejected') {
        if (confirmStatusIndex !== -1) {
          newChecked.splice(confirmStatusIndex, 1);
        }
      }

      // remove rejected and blocked status if confirmed set
      if (value === 'confirmed') {
        const rejectedStatusIndex = newChecked.indexOf('rejected');

        if (rejectedStatusIndex !== -1) {
          newChecked.splice(rejectedStatusIndex, 1);
        }

        const blockedStatusIndex = newChecked.indexOf('blocked');

        if (blockedStatusIndex !== -1) {
          newChecked.splice(blockedStatusIndex, 1);
        }
      }

      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleSaveClick = async () => {
    setLoading(true);

    if (!isNewUser && profileId && profile.user.id) {
      try {
        const attendanceConfirmed = checked.indexOf('confirmed') !== -1;
        const rejected = checked.indexOf('rejected') !== -1;
        await updateProfile(
          {
            attendanceConfirmed,
            rejected,
            // set to silent, do not notify user of settings change
            silent: true,

            // NOTE: role and blocked here does not update profile,
            // it is only used in API controller "api:profile.profile.update"
            // to add to ProfileLog
            role: checked.indexOf('speaker') !== -1 ? 'speaker' : 'visitor',
            blocked: checked.indexOf('blocked') !== -1 ? true : false,
          },
          profileId as string,
        );

        // NOTE: updateRole must be called after update profile
        // to ensure role changes are captured in API ProfileLog
        // in the above updateProfile call
        await updateUser(`${profile.user.id}`, checked);

        dispatch(
          openSnackbar({
            open: true,
            message: 'Settings updated successfully.',
            variant: 'alert',
            alert: {
              color: 'success',
            },
            close: false,
          }),
        );

        setStatus({ error: '', loading: false });
        router.push(`/admin/${visitorSpeaker}/${profileId}/settings`);
      } catch (e) {
        setStatus({ error: e.message, loading: false });
        dispatch(
          openSnackbar({
            open: true,
            message: `There was an error updating settings`,
            variant: 'alert',
            alert: {
              color: 'error',
            },
            close: false,
          }),
        );
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setChecked(getStatusFromProfile(profile));
  }, [profile]);

  if (loading) return <Loader />;

  return (
    <MainCard title="Settings">
      <List sx={{ '& .MuiListItem-root': { p: 2 } }}>
        <ListItem divider>
          <ListItemIcon
            sx={{
              color: 'primary.main',
              mr: 2,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <FileDoneOutlined style={{ fontSize: '1.5rem' }} />
          </ListItemIcon>
          <ListItemText
            id="switch-list-label-oc"
            primary={<Typography variant="h5">Speaker Status</Typography>}
            secondary="Set weather a user is a speaker on visitor"
          />
          <Switch
            disabled={isNewUser}
            edge="end"
            onChange={handleToggle('speaker')}
            checked={checked.indexOf('speaker') !== -1}
            inputProps={{
              'aria-labelledby': 'switch-list-label-oc',
            }}
          />
        </ListItem>
        <ListItem divider>
          <ListItemIcon
            sx={{
              color: 'primary.main',
              mr: 2,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <MailOutlined style={{ fontSize: '1.5rem' }} />
          </ListItemIcon>
          <ListItemText
            id="switch-list-label-sen"
            primary={<Typography variant="h5">Attendance Confirmed</Typography>}
            secondary="Set a user attendance status"
          />
          <Switch
            disabled={isNewUser}
            edge="end"
            onChange={handleToggle('confirmed')}
            checked={checked.indexOf('confirmed') !== -1}
            inputProps={{
              'aria-labelledby': 'switch-list-label-sen',
            }}
          />
        </ListItem>
        <ListItem divider>
          <ListItemIcon
            sx={{
              color: 'primary.main',
              mr: 2,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <StopOutlined style={{ fontSize: '1.5rem' }} />
          </ListItemIcon>
          <ListItemText
            id="switch-list-label-sen"
            primary={<Typography variant="h5">Rejected Status</Typography>}
            secondary="Set rejected status of the user"
          />
          <Switch
            disabled={isNewUser}
            edge="end"
            onChange={handleToggle('rejected')}
            checked={checked.indexOf('rejected') !== -1}
            inputProps={{
              'aria-labelledby': 'switch-list-label-sen',
            }}
          />
        </ListItem>
        <ListItem divider>
          <ListItemIcon
            sx={{
              color: 'primary.main',
              mr: 2,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <LockOutlined style={{ fontSize: '1.5rem' }} />
          </ListItemIcon>
          <ListItemText
            id="switch-list-label-sen"
            primary={<Typography variant="h5">Block User</Typography>}
            secondary="Block the user profile"
          />
          <Switch
            disabled={isNewUser}
            edge="end"
            onChange={handleToggle('blocked')}
            checked={checked.indexOf('blocked') !== -1}
            inputProps={{
              'aria-labelledby': 'switch-list-label-sen',
            }}
          />
        </ListItem>
      </List>
      {isNewUser && (
        <Box>
          <Typography textAlign="end" color="text.disabled">
            *User needs to be created before editing settings
          </Typography>
        </Box>
      )}
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
          disabled={!!(status.loading || status.error || isNewUser)}
          variant="contained"
          onClick={handleSaveClick}
        >
          Save
        </Button>
      </Stack>
    </MainCard>
  );
};

export default AdminTabSettings;
