import { createContext, ReactNode, useEffect, useState } from 'react';

// project import
import { sleep } from 'utils/sleep';
import { JWTToken, User, UserProfile, UserRole, UserRoleEnum } from 'models/auth';
import { getTokenFromStorage, isTokenExpired, parseToken, setTokenInStorage } from 'utils/jwt';
import { apiReq } from 'lib/api';
import { PROFILE, USER } from 'lib/endpoints';
import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { useRouter } from 'next/router';
import { getProfileStatus } from 'lib/utils';

// types

type AuthContextProps = {
  role: UserRoleEnum | null;
  user: User;
  profile: UserProfile;
  loading: boolean;
  error: object | string | null;
  setLoading: (state: boolean) => void;
  reloadProfile: () => void;
};

const initialState: AuthContextProps = {
  role: null,
  loading: true,
  error: null,
  user: {} as User,
  profile: {} as UserProfile,
  setLoading: (state: boolean) => {},
  reloadProfile: () => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const AuthContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactNode;
};

function AuthContextProvider({ children }: ConfigProviderProps) {
  const router = useRouter();
  const [authState, setAuthState] = useState(initialState);

  const setLoading = (loading: boolean) => {
    setAuthState((old) => ({ ...old, loading }));
  };

  const setRole = (role: UserRoleEnum) => {
    setAuthState((old) => ({ ...old, role }));
  };

  const setError = (e: any) => {
    setAuthState((old) => ({
      ...old,
      role: null,
      loading: false,
      error: `${e}`
    }));
  };

  const getUser = async (token: JWTToken): Promise<User | null> => {
    try {
      const headers = {
        Authorization: `Bearer ${token.str}`
      };

      const res = await apiReq<User>({ endpoint: USER, headers });

      if (res.error) {
        setError(res.error);
        return null;
      }
      return res.data;
    } catch (e) {
      setError('There was an error getting user');
      return null;
    }
  };

  const getProfile = async (token: JWTToken): Promise<UserProfile | null> => {
    try {
      const headers = {
        Authorization: `Bearer ${token.str}`
      };

      const res = await apiReq<UserProfile>({ endpoint: PROFILE, headers });

      const status = getProfileStatus(res.data);
      res.data['status'] = status;

      if (res.error) {
        setError(res.error);
        return null;
      }
      return res.data;
    } catch (e) {
      setError('There was an error getting profile');
      return null;
    }
  };

  const reloadProfile = async () => {
    initAuth();
  };

  const validateTokenExp = () => {
    const token = getTokenFromStorage();

    // Return early if no token in local storage
    if (!token) {
      setLoading(false);
      // setError('No token found');
      return;
    }

    if (isTokenExpired(token)) {
      setTokenInStorage(null);
      setError('Token is expired');
      return;
    }
  };

  // On load check for JWT token in local storage
  const initAuth = async () => {
    validateTokenExp();

    const token = getTokenFromStorage();

    if (!token) {
      setLoading(false);
      // setError('No token found');
      return;
    }

    const user = await getUser(token);
    const profile = await getProfile(token);

    await sleep(1);

    // Return early if failed get get user from API
    if (user && profile) {
      setTokenInStorage(token);

      try {
        const role = user.role ? user.role.type : profile.user.role.type;

        setAuthState((old) => ({
          ...old,
          loading: false,
          role: role as UserRoleEnum,
          user,
          profile
        }));
      } catch (e) {
        setTokenInStorage(null);
      }
    } else {
      setAuthState((old) => ({
        ...old,
        loading: false
      }));
      setTokenInStorage(null);

      return;
    }
  };

  useEffect(() => {
    if (authState.error) {
      dispatch(
        openSnackbar({
          open: true,
          message: authState.error,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
    }
  }, [authState.error]);

  useEffect(() => {
    initAuth();
  }, [authState.loading]);

  // Validate token on each route change
  useEffect(() => {
    validateTokenExp();
  }, [router.asPath]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        setLoading,
        reloadProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider, AuthContext };
