// Auth endpoints

export const PROFILE = '/api/profiles/me';
export const PROFILES = '/api/profiles?populate[0]=user.role';
export const REGISTER = '/api/auth/local/register';
export const LOGIN = '/api/auth/local';
export const FORGOT_PASSWORD = '/api/auth/forgot-password';
export const RESET_PASSWORD = '/api/auth/reset-password';
export const USER = '/api/users/me?populate[0]=role';
export const EMAIL_CONFIRMATION = '/api/auth/send-email-confirmation';

const populateUserParams =
  'populate[0]=user.role&populate[1]=profilePic&populate[2]=idImage&populate[3]=passportPhoto&populate[4]=abstract.video&populate[5]=abstract.documents&populate[6]=attendanceType&populate[7]=abstract.document';

export const GET_PROFILE = (id: string) => `/api/profiles/${id}?${populateUserParams}`;
