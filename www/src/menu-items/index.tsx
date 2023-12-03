// project import
import admin from './admin';
import profile from './profile';

//types
import { NavItemType } from 'types/menu';
import { UserRole, UserRoleEnum } from 'models/auth';

// ==============================|| MENU ITEMS ||============================== //
type MenuItems = { items: NavItemType[] };

const adminMenuItems: { items: NavItemType[] } = {
  items: [admin, profile]
};

const userMenuItems: { items: NavItemType[] } = {
  items: [profile]
};

const getMenuItems = (role: UserRoleEnum | null): MenuItems => {
  switch (role) {
    case 'admin':
      return adminMenuItems;

    default:
      return userMenuItems;
  }
};

export default getMenuItems;
