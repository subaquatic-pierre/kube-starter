// material-ui
import { Badge } from '@mui/material';

// project imports
import AvatarStatus from './AvatarStatus';
import { UserProfile } from 'models/auth';
import Avatar from 'components/@extended/Avatar';

// ==============================|| CHAT USER AVATAR WITH STATUS ICON ||============================== //

interface UserAvatarProps {
  user: UserProfile;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <Badge
      overlap="circular"
      // badgeContent={<AvatarStatus status={user.online_status!} />}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiBox-root': { width: 6, height: 6 },
        padding: 0,
        minWidth: 12,
        '& svg': { background: '#fff', borderRadius: '50%' },
      }}
    >
      <Avatar
        alt={user.firstName}
        // src={user.profilePic && user.profilePic.url ? user.profilePic.url : ''}
      />
    </Badge>
  );
};

export default UserAvatar;
