import { JWTToken } from 'models/auth';

export const parseToken = (token: string): JWTToken => {
  const _token = JSON.parse(atob(token.split('.')[1]));
  _token.str = token;
  return _token;
};

export const isTokenExpired = (token: { exp: number }): boolean => {
  return Date.now() >= token.exp * 1000;
};

export const setTokenInStorage = (token: JWTToken | null) => {
  if (!token) {
    window.localStorage.removeItem('token');
  } else {
    window.localStorage.setItem('token', token.str);
  }
};

export const getTokenFromStorage = (): JWTToken | null => {
  const tokenStr = window.localStorage.getItem('token');

  if (!tokenStr) {
    return null;
  }

  const token = parseToken(tokenStr);

  return token;
};
