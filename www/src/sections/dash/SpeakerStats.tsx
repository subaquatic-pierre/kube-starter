// material-ui
import {
  AvatarGroup,
  Button,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';

// assets
import {
  CheckOutlined,
  QuestionOutlined,
  InfoOutlined,
  WarningOutlined,
  CloseOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { UserProfile } from 'models/auth';
import Link from 'next/link';

const avatar1 = '/assets/images/users/avatar-1.png';
const avatar2 = '/assets/images/users/avatar-2.png';
const avatar3 = '/assets/images/users/avatar-3.png';
const avatar4 = '/assets/images/users/avatar-4.png';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem',
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none',
};

// ==============================|| SPEAKER STATS ||============================== //
interface Props {
  allUsers: UserProfile[];
}

const SpeakerStats: React.FC<Props> = ({ allUsers = [] }) => {
  const theme = useTheme();
  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Speaker Statistics</Typography>
        </Grid>
      </Grid>
      <MainCard sx={{ mt: 2 }} content={false}>
        <List
          component="nav"
          sx={{
            p: 0,
            '& a': {
              all: 'unset',
            },
            '& .MuiListItemButton-root': {
              py: 1.5,
              '& .MuiAvatar-root': avatarSX,
              '& .MuiListItemSecondaryAction-root': {
                ...actionSX,
                position: 'relative',
              },
            },
          }}
        >
          <Link href={`/admin/speakers?sortBy=confirmed`}>
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: 'success.main',
                    bgcolor: 'success.lighter',
                  }}
                >
                  <CheckOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">Confirmed</Typography>}
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    {
                      allUsers.filter(
                        (user) =>
                          user.status === 'confirmed' &&
                          user.user.role.type === 'speaker',
                      ).length
                    }
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
          </Link>

          <Link href={`/admin/speakers?sortBy=pending`}>
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: `${theme.palette.info.main}`,
                    bgcolor: `${theme.palette.error.lighter}`,
                  }}
                >
                  <InfoOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">Pending</Typography>}
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    {
                      allUsers.filter(
                        (user) =>
                          user.status === 'pending' &&
                          user.user.role.type === 'speaker',
                      ).length
                    }
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
          </Link>

          <Link href={`/admin/speakers?sortBy=incomplete`}>
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: `${theme.palette.warning.main}`,
                    bgcolor: `${theme.palette.error.lighter}`,
                  }}
                >
                  <QuestionOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">Missing Profile</Typography>
                }
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    {
                      allUsers.filter(
                        (user) =>
                          user.status === 'incomplete' &&
                          user.user.role.type === 'speaker',
                      ).length
                    }
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
          </Link>

          <Link href={`/admin/visitors?sortBy=rejected`}>
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: `${theme.palette.error.main}`,
                    bgcolor: `${theme.palette.error.lighter}`,
                  }}
                >
                  <WarningOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">Rejected</Typography>}
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    {
                      allUsers.filter(
                        (user) =>
                          user.status === 'rejected' &&
                          user.user.role.type === 'speaker',
                      ).length
                    }
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
          </Link>
        </List>
      </MainCard>
    </>
  );
};

export default SpeakerStats;
