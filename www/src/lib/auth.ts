import { StrapiResponse, strapiReq, strapiReqWithAuth } from 'lib/api';
import { generateId } from 'lib/utils';
import {
  EMAIL_CONFIRMATION,
  FORGOT_PASSWORD,
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
} from 'lib/endpoints';
import { User } from 'models/auth';
import { setTokenInStorage } from 'utils/jwt';

interface LoginArgs {
  email: string;
  password: string;
  speaker?: boolean;
}
interface ResetPasswordArgs {
  code: string;
  password: string;
  passwordConfirmation: string;
}
interface ForgotPasswordArgs {
  email: string;
}

type LoginResponse = { jwt: string; user: User | null };
type RegisterResponse = {
  user: {
    id: number;
  };
};

export const login = async ({
  email,
  password,
}: LoginArgs): Promise<StrapiResponse<LoginResponse>> => {
  const data = {
    identifier: email,
    password,
  };
  return strapiReq<LoginResponse>({ endpoint: LOGIN, method: 'POST', data });
};

export const forgotPassword = async ({
  email,
}: ForgotPasswordArgs): Promise<StrapiResponse> => {
  const data = {
    email: email,
  };

  return strapiReq({
    endpoint: FORGOT_PASSWORD,
    method: 'POST',
    data,
  });
};

export const resetPassword = async ({
  code,
  password,
  passwordConfirmation,
}: ResetPasswordArgs): Promise<StrapiResponse> => {
  const data = {
    code,
    password,
    passwordConfirmation,
  };

  return strapiReq({
    endpoint: RESET_PASSWORD,
    method: 'POST',
    data,
  });
};

export const register = async ({
  email,
  password,
  speaker,
}: LoginArgs): Promise<StrapiResponse<RegisterResponse>> => {
  const data = {
    username: generateId(),
    email: email,
    password,
    speaker,
  };
  return strapiReq({ endpoint: REGISTER, method: 'POST', data });
};

export const logout = async (): Promise<StrapiResponse> => {
  setTokenInStorage(null);
  return { data: {} };
};

export const sendConfirmationEmail = async (email: string) => {
  return await strapiReqWithAuth({
    endpoint: EMAIL_CONFIRMATION,
    method: 'POST',
    data: { email },
  });
};
