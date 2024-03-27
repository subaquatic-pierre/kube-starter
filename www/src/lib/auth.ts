import { ApiResponse, apiReq, apiReqWithAuth } from 'lib/api';
import { generateId } from 'lib/utils';
import { EMAIL_CONFIRMATION, FORGOT_PASSWORD, LOGIN, REGISTER, RESET_PASSWORD } from 'lib/endpoints';
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

type LoginResponse = { token: string; user: User | null };
type RegisterResponse = {
  user: {
    id: number;
  };
};

export const login = async ({ email, password }: LoginArgs): Promise<ApiResponse<LoginResponse>> => {
  const data = {
    email,
    password
  };
  return apiReq<LoginResponse>({ endpoint: LOGIN, method: 'POST', data });
};

export const forgotPassword = async ({ email }: ForgotPasswordArgs): Promise<ApiResponse> => {
  const data = {
    email: email
  };

  return apiReq({
    endpoint: FORGOT_PASSWORD,
    method: 'POST',
    data
  });
};

export const resetPassword = async ({ code, password, passwordConfirmation }: ResetPasswordArgs): Promise<ApiResponse> => {
  const data = {
    code,
    password,
    passwordConfirmation
  };

  return apiReq({
    endpoint: RESET_PASSWORD,
    method: 'POST',
    data
  });
};

export const register = async ({ email, password }: LoginArgs): Promise<ApiResponse<RegisterResponse>> => {
  const data = {
    name: generateId(),
    email: email,
    password,
    passwordConfirm: password
  };
  return apiReq<RegisterResponse>({ endpoint: REGISTER, method: 'POST', data });
};

export const logout = async (): Promise<ApiResponse> => {
  setTokenInStorage(null);
  return { data: {} };
};

export const sendConfirmationEmail = async (email: string) => {
  return await apiReqWithAuth({
    endpoint: EMAIL_CONFIRMATION,
    method: 'POST',
    data: { email }
  });
};
