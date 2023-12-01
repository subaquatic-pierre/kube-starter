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
  UserOutlined,
  CalendarOutlined,
  FormOutlined,
  MessageOutlined,
} from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons

// ==============================|| MENU ITEMS - PAGES ||============================== //

const author: NavItemType = {
  id: 'group-admin',
  title: 'Admin',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      icon: DashboardOutlined,
      url: '/admin',
    },
    // {
    //   id: 'schedule',
    //   title: 'Schedule',
    //   type: 'item',
    //   url: '/admin/schedule',
    //   icon: CalendarOutlined,
    // },
    {
      id: 'messages',
      title: 'Messages',
      type: 'item',
      url: '/admin/messages',
      icon: MessageOutlined,
    },
    {
      id: 'visitors',
      title: 'Visitors',
      type: 'item',
      icon: UserDeleteOutlined,
      url: '/admin/visitors',
    },
    // {
    //   id: 'speakers',
    //   title: 'Speakers',
    //   type: 'item',
    //   icon: UserDeleteOutlined,
    //   url: '/admin/speakers',
    // },
  ],
};

export default author;
