import { ReactElement } from 'react';

// material-ui

import MainLayout from './MainLayout';
import AuthGuard from 'components/AuthGuard';
import GuestGuard from 'components/GuestGuard';

// ==============================|| LAYOUTS - STRUCTURE ||============================== //

interface Props {
  children: ReactElement;
  variant?: 'main' | 'blank' | 'guest';
  admin?: boolean;
}

export default function Layout({ variant = 'main', admin = true, children }: Props) {
  if (variant === 'blank') {
    return children;
  } else {
    return children;
  }

  // if (variant === 'guest') {
  //   return (
  //     <GuestGuard>
  //       <MainLayout>{children}</MainLayout>
  //     </GuestGuard>
  //   );
  // }

  // return (
  //   <AuthGuard admin={admin}>
  //     <MainLayout>{children}</MainLayout>
  //   </AuthGuard>
  // );
}
