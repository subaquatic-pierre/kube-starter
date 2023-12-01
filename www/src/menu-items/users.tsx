// third-party

// assets
import {
  DollarOutlined,
  LoginOutlined,
  PhoneOutlined,
  RocketOutlined,
  DashboardOutlined,
  SoundOutlined,
  UserDeleteOutlined,
  UserOutlined
} from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons

// ==============================|| MENU ITEMS - PAGES ||============================== //

const users: NavItemType = {
  id: 'group-users',
  title: 'Users',
  type: 'group',
  children: [
    {
      id: 'visitors',
      title: 'Visitors',
      type: 'item',
      icon: UserDeleteOutlined,
      url: '/users/visitors'
    },
    {
      id: 'speakers',
      title: 'Speakers',
      type: 'item',
      icon: SoundOutlined,
      url: '/users/speakers'
    },
    {
      id: 'members',
      title: 'Members',
      type: 'item',
      icon: UserOutlined,
      url: '/users/members'
    }
  ]
};

export default users;
