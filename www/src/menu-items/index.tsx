// project import
import admin from './admin';
import users from './users';
import profile from './profile';
import member from './member';
import author from './author';
import organizer from './organizer';

//types
import { NavItemType } from 'types/menu';
import { UserRole, UserRoleEnum } from 'models/auth';

// ==============================|| MENU ITEMS ||============================== //
type MenuItems = { items: NavItemType[] };

const adminMenuItems: { items: NavItemType[] } = {
  items: [admin, profile],
};

const userMenuItems: { items: NavItemType[] } = {
  items: [profile],
};

const memberMenuItems: { items: NavItemType[] } = {
  items: [member, profile],
};
const authorMenuItems: { items: NavItemType[] } = {
  items: [author, profile],
};

const organizerMenuItems: { items: NavItemType[] } = {
  items: [organizer, profile],
};

const getMenuItems = (role: UserRoleEnum | null): MenuItems => {
  switch (role) {
    case 'admin':
      return adminMenuItems;

    case 'visitor':
      return userMenuItems;

    case 'speaker':
      return userMenuItems;

    case 'member':
      return memberMenuItems;

    case 'author':
      return authorMenuItems;

    case 'organizer':
      return organizerMenuItems;

    default:
      return userMenuItems;
  }
};

export default getMenuItems;
