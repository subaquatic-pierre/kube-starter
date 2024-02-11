import Loader from 'components/Loader';
import useAuth from 'hooks/useAuth';
import { useRouter } from 'next/router';

interface Props extends React.PropsWithChildren {
  admin?: boolean;
}

const AuthGuard: React.FC<Props> = ({ children, admin }) => {
  const router = useRouter();
  const { loading, role, error } = useAuth();

  if (loading) return <Loader />;

  // Check if route is only accessible by admin, admin prop is boolean
  // used as flag to set route as protected, only accessible by admin types
  // if (admin && role !== 'admin') {
  //   router.push('/login');
  //   return <></>;
  //} // Redirect to login if not loading or not role
  if (error || (!loading && !role)) {
    router.push({ pathname: '/login', query: router.query });
    return <></>;
  } else {
    return <>{children}</>;
  }
};

export default AuthGuard;
