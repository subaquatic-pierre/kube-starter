import { lazy, Suspense, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { Container, Toolbar } from '@mui/material';
import { openComponentDrawer } from 'store/reducers/menu';

// project import
import ComponentLayout from './ComponentLayout';
import MainLayout from './MainLayout';

const Header = lazy(() => import('./Header'));
const FooterBlock = lazy(() => import('./FooterBlock'));

// material-ui
import { RootStateProps } from 'types/root';

import AuthGuard from 'components/AuthGuard';
import GuestGuard from 'components/GuestGuard';
import { Box } from '@mui/system';

// ==============================|| LAYOUTS - STRUCTURE ||============================== //

export interface LoaderProps extends LinearProgressProps {}

const Loader = () => (
  <Box
    sx={(theme) => ({
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 2001,
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2)
      }
    })}
  >
    <LinearProgress color="primary" />
  </Box>
);

interface Props {
  children: ReactElement;
  variant?: 'main' | 'blank' | 'guest';
  admin?: boolean;
}

export default function Layout({ variant = 'main', admin = true, children }: Props) {
  const dispatch = useDispatch();

  const menu = useSelector((state: RootStateProps) => state.menu);
  const { componentDrawerOpen } = menu;

  const handleDrawerOpen = () => {
    dispatch(openComponentDrawer({ componentDrawerOpen: !componentDrawerOpen }));
  };

  if (variant === 'guest') {
    return (
      <Suspense fallback={<Loader />}>
        <Header layout={variant} />
        {children}
        <FooterBlock isFull={variant === 'guest'} />
      </Suspense>
    );
  }

  if (variant === 'blank') {
    return children;
  }

  return (
    <AuthGuard admin={admin}>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}
