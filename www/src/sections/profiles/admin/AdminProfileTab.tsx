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
  AimOutlined,
} from '@ant-design/icons';
import { UserProfile } from 'models/auth';
import useAuth from 'hooks/useAuth';

function getPathIndex(
  asPath: string,
  visitorSpeaker: string,
  profileId: string,
) {
  let selectedTab = 0;
  switch (asPath) {
    case `/admin/${visitorSpeaker}/${profileId ?? 'new'}/abstract`:
      selectedTab = 1;
      break;
    case `/admin/${visitorSpeaker}/${profileId ?? 'new'}/settings`:
      selectedTab = 2;
      break;
    case `/admin/${visitorSpeaker}/${profileId ?? 'new'}/ticket`:
      selectedTab = 3;
      break;
    case `/admin/${visitorSpeaker}/${profileId ?? 'new'}/logs`:
      selectedTab = 4;
      break;

    case `/admin/${visitorSpeaker}/${profileId ?? 'new'}/certificate`:
      selectedTab = 5;
      break;
    case `/admin/${visitorSpeaker}/${profileId ?? 'new'}/attendance`:
      selectedTab = 6;
      break;

    case `/admin/${visitorSpeaker}/${profileId ?? 'new'}/personal`:

    default:
      selectedTab = 0;
  }
  return selectedTab;
}

// ==============================|| USER PROFILE - TAB ||============================== //

interface Props {
  profile: Partial<UserProfile>;
}

const AdminProfileTab: React.FC<Props> = ({ profile }) => {
  const theme = useTheme();
  const router = useRouter();
  const { role: adminRole } = useAuth();
  const { profileId, visitorSpeaker } = router.query;
  const { asPath } = router;

  const [selectedIndex, setSelectedIndex] = useState(
    getPathIndex(asPath, visitorSpeaker as string, profileId as string),
  );

  const handleListItemClick = (index: number, route: string) => {
    setSelectedIndex(index);
    router.push(route);
  };

  useEffect(() => {
    setSelectedIndex(
      getPathIndex(asPath, visitorSpeaker as string, profileId as string),
    );
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
        onClick={() =>
          handleListItemClick(
            0,
            `/admin/${visitorSpeaker}/${profileId ?? 'new'}/personal`,
          )
        }
      >
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Personal Information" />
      </ListItemButton>

      {profile.attendanceConfirmed && (
        <ListItemButton
          selected={selectedIndex === 3}
          onClick={() =>
            handleListItemClick(
              3,
              `/admin/${visitorSpeaker}/${profileId}/ticket`,
            )
          }
        >
          <ListItemIcon>
            <SnippetsOutlined />
          </ListItemIcon>
          <ListItemText primary="Ticket" />
        </ListItemButton>
      )}

      {profile && profile.user?.role?.type === 'speaker' && (
        <ListItemButton
          selected={selectedIndex === 1}
          onClick={() =>
            handleListItemClick(
              1,
              `/admin/${visitorSpeaker}/${profileId ?? 'new'}/abstract`,
            )
          }
        >
          <ListItemIcon>
            <FormOutlined />
          </ListItemIcon>
          <ListItemText primary="Abstract" />
        </ListItemButton>
      )}
      {adminRole === 'admin' && (
        <ListItemButton
          selected={selectedIndex === 2}
          onClick={() =>
            handleListItemClick(
              2,
              `/admin/${visitorSpeaker}/${profileId}/settings`,
            )
          }
        >
          <ListItemIcon>
            <LockOutlined />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      )}
      <ListItemButton
        selected={selectedIndex === 5}
        onClick={() =>
          handleListItemClick(
            5,
            `/admin/${visitorSpeaker}/${profileId}/certificate`,
          )
        }
      >
        <ListItemIcon>
          <SafetyCertificateOutlined />
        </ListItemIcon>
        <ListItemText primary="Certificate" />
      </ListItemButton>
      <ListItemButton
        selected={selectedIndex === 4}
        onClick={() =>
          handleListItemClick(4, `/admin/${visitorSpeaker}/${profileId}/logs`)
        }
      >
        <ListItemIcon>
          <SnippetsOutlined />
        </ListItemIcon>
        <ListItemText primary="Logs" />
      </ListItemButton>
      <ListItemButton
        selected={selectedIndex === 6}
        onClick={() =>
          handleListItemClick(
            6,
            `/admin/${visitorSpeaker}/${profileId}/attendance`,
          )
        }
      >
        <ListItemIcon>
          <AimOutlined />
        </ListItemIcon>
        <ListItemText primary="Attendance" />
      </ListItemButton>
    </List>
  );
};

export default AdminProfileTab;
