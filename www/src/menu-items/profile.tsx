// third-party

// assets
import { UserOutlined, MessageOutlined, VideoCameraOutlined } from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons

// ==============================|| MENU ITEMS - PAGES ||============================== //

const profile: NavItemType = {
  id: 'group-profile',
  title: 'Profile',
  type: 'group',
  children: [
    {
      id: 'profile',
      title: 'User Profile',
      type: 'item',
      icon: UserOutlined,
      url: '/profile/personal'
    },
    // {
    //   id: 'certifications',
    //   title: 'Certifications',
    //   type: 'item',
    //   icon: FileTextOutlined,
    //   url: '/profile/certifications'
    // },
    {
      id: 'message',
      title: 'My Messages',
      type: 'item',
      icon: MessageOutlined,
      url: '/profile/messages'
    }
    // {
    //   id: 'stream',
    //   title: 'Session Recordings',
    //   type: 'item',
    //   icon: VideoCameraOutlined,
    //   url: '/profile/stream',
    // },
  ]
};

export default profile;
