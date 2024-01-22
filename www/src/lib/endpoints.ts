const populateUserParams =
  'populate[0]=user.role&populate[1]=profilePic&populate[2]=idImage&populate[3]=passportPhoto&populate[4]=abstract.video&populate[5]=abstract.documents&populate[6]=attendanceType&populate[7]=abstract.document';

// Auth endpoints
export const GET_USERS = `/api/profiles?${populateUserParams}`;
export const GET_ADMINS = `/api/profiles/admins`;

export const PROFILE = '/cms/profiles/me';
export const PROFILES = '/cms/profiles?populate[0]=user.role';
export const REGISTER = '/cms/auth/local/register';
export const LOGIN = '/cms/auth/local';
export const FORGOT_PASSWORD = '/cms/auth/forgot-password';
export const RESET_PASSWORD = '/cms/auth/reset-password';
export const USER = '/cms/users/me?populate[0]=role';
export const EMAIL_CONFIRMATION = '/cms/auth/send-email-confirmation';

export const GET_PROFILE = (id: string) => `/cms/profiles/${id}?${populateUserParams}`;

// Message Endpoints
// Message endpoints
export const GET_MESSAGES =
  '/api/messages?populate[0]=toUser.user.role&populate[1]=fromUser.user.role&sort=createdAt:desc&pagination[pageSize]=100';

export const GET_CONTACT_MESSAGES =
  '/api/messages?populate[0]=toUser.user&populate[1]=fromUser.user&sort=createdAt&pagination[pageSize]=100&filters[isContactMessage][$eq]=true';

export const CREATE_MESSAGE =
  '/api/messages?&populate[0]=toUser.user.role&populate[1]=toUser.abstract&populate[2]=fromUser.user.role&populate[3]=fromUser.abstract';

export const GET_MESSAGES_BY_USER = (id: string) =>
  `/api/messages?populate[0]=toUser.user.role&populate[1]=fromUser.user.role&sort=createdAt&pagination[pageSize]=100&filters[$or][0][fromUser][id][$eq]=${id}&filters[$or][1][toUser][id][$eq]=${id}`;

export const UPDATE_MESSAGE = (id: string) =>
  `/api/messages/${id}?populate[0]=toUser.user.role&populate[1]=fromUser.user.role&sort=createdAt&populate[2]=toUser.abstract&populate[3]=fromUser.abstract`;

// Events
export const CALENDAR_EVENTS = '/api/events';

export const CALENDAR_EVENTS_POPULATE_SPEAKER = '/api/events?populate[0]=speaker';
