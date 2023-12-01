// third-party

// assets
import {
  DashboardOutlined,
  MessageOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons

// ==============================|| MENU ITEMS - PAGES ||============================== //

const member: NavItemType = {
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
    // {
    //   id: 'visitors',
    //   title: 'Visitors',
    //   type: 'item',
    //   icon: UserDeleteOutlined,
    //   url: '/admin/visitors',
    // },
    {
      id: 'speakers',
      title: 'Speakers',
      type: 'item',
      icon: UserSwitchOutlined,
      url: '/admin/speakers',
    },
  ],
};

export default member;
