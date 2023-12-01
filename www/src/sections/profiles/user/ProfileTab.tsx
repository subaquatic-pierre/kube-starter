import { useEffect, useState } from 'react';

// next
import { useRouter } from 'next/router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

// assets
import {
  CreditCardOutlined,
  LockOutlined,
  SnippetsOutlined,
  FormOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import useAuth from 'hooks/useAuth';

function getPathIndex(asPath: string) {
  let selectedTab = 0;
  switch (asPath) {
    case '/profile/abstract':
      selectedTab = 1;
      break;
    case '/profile/password':
      selectedTab = 2;
      break;
    case '/profile/ticket':
      selectedTab = 3;
      break;
    case '/profile/certificate':
      selectedTab = 4;
      break;
      case '/profile/download':
        selectedTab = 5;
        break;

    case '/profile/personal':
    default:
      selectedTab = 0;
  }
  return selectedTab;
}

// ==============================|| USER PROFILE - TAB ||============================== //

const ProfileTab = () => {
  const theme = useTheme();
  const { profile } = useAuth();
  const router = useRouter();
  const { asPath } = router;

  const [selectedIndex, setSelectedIndex] = useState(getPathIndex(asPath));
  const handleListItemClick = (index: number, route: string) => {
    setSelectedIndex(index);
    router.push(route);
  };

  useEffect(() => {
    setSelectedIndex(getPathIndex(asPath));
  }, [asPath]);

  return (
    <List
      component="nav"
      sx={{
        p: 0,
        '& .MuiListItemIcon-root': {
          minWidth: 32,
          color: theme.palette.grey[500],
        },
      }}
    >
      <ListItemButton
        selected={selectedIndex === 0}
        onClick={() => handleListItemClick(0, '/profile/personal')}
      >
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Personal Information" />
      </ListItemButton>

      {profile && profile.attendanceConfirmed && (
        <ListItemButton
          selected={selectedIndex === 3}
          onClick={() => handleListItemClick(3, '/profile/ticket')}
        >
          <ListItemIcon>
            <SnippetsOutlined />
          </ListItemIcon>
          <ListItemText primary="Ticket" />
        </ListItemButton>
      )}

      {profile &&
        (profile.user?.role.name === 'Admin' ||
          profile.user?.role.name === 'Speaker') && (
          <ListItemButton
            selected={selectedIndex === 1}
            onClick={() => handleListItemClick(1, '/profile/abstract')}
          >
            <ListItemIcon>
              <FormOutlined />
            </ListItemIcon>
            <ListItemText primary="Abstract" />
          </ListItemButton>
        )}

      {profile && (
        <ListItemButton
          selected={selectedIndex === 4}
          onClick={() => handleListItemClick(4, '/profile/certificate')}
        >
          <ListItemIcon>
            <SafetyCertificateOutlined />
          </ListItemIcon>
          <ListItemText primary="Certificate" />
        </ListItemButton>
      )}
       {profile && (
        <ListItemButton
          selected={selectedIndex === 5}
          onClick={() => handleListItemClick(5, '/profile/download')}
        >
          <ListItemIcon>
            <DownloadOutlined />
          </ListItemIcon>
          <ListItemText primary="Download Materials" />
        </ListItemButton>
      )}
      {/* <ListItemButton
        selected={selectedIndex === 2}
        onClick={() => handleListItemClick(2, '/profile/password')}
      >
        <ListItemIcon>
          <LockOutlined />
        </ListItemIcon>
        <ListItemText primary="Change Password" />
      </ListItemButton> */}
    </List>
  );
};

export default ProfileTab;
