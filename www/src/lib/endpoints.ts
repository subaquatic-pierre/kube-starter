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

// User endpoints
export const GET_USERS = `/api/profiles?${populateUserParams}`;
export const GET_ADMINS = `/api/profiles/admins`;
export const GET_USER = (id: string) =>
  `/api/users/${id}?populate[0]=role&populate[1]=profile`;
export const GET_PROFILE = (id: string) =>
  `/api/profiles/${id}?${populateUserParams}`;
export const UPDATE_PROFILE = (id: string) =>
  `/api/profiles/${id}?${populateUserParams}`;
export const NEW_PROFILE = `/api/profiles`;
export const UPDATE_USER = (id: string) =>
  `/api/users/${id}?populate[0]=user.role`;
export const GET_SPEAKERS =
  '/api/profiles?filters[user][role][type][$eq]=speaker&populate[0]=user.role&populate[1]=profilePic&populate[2]=idImage&populate[3]=passportPhoto&populate[4]=attendanceType';
export const GET_VISITORS =
  '/api/profiles?filters[user][role][type][$eq]=visitor&populate[0]=user.role&populate[1]=idImage&populate[2]=profilePic&populate[3]=passportPhoto&populate[4]=attendanceType';

// Logs
// export const GET_PROFILE_LOGS = (id: string) => `/api/profile-logs`;
export const GET_PROFILE_LOGS = (id: string) =>
  `/api/profile-logs?filters[profile][id][$eq]=${id}&populate[0]=admin.profile.user&populate[1]=profile.profile.user`;

// Abstract endpoints
export const UPDATE_ABSTRACT = (id: string) =>
  `/api/abstracts/${id}?populate[0]=video&populate[1]=document`;
export const CREATE_ABSTRACT = `/api/abstracts?populate[0]=video&populate[1]=document&populate[2]=profile`;

export const CALENDAR_EVENTS = '/api/events';

export const CALENDAR_EVENTS_POPULATE_SPEAKER =
  '/api/events?populate[0]=speaker';

// Notification endpoints
export const GET_NOTIFICATIONS =
  '/api/notifications?populate[0]=toUser.user.role&populate[1]=fromUser.user.role&sort=time&populate[2]=toUser.abstract&populate[3]=fromUser.abstract&sort[0]=createdAt:desc&pagination[pageSize]=100';

export const UPDATE_NOTIFICATION = (id: string) =>
  `/api/notifications/${id}?populate[0]=toUser.user.role&populate[1]=fromUser.user.role&sort=time&populate[2]=toUser.abstract&populate[3]=fromUser.abstract`;

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

// Attend records.role
export const NEW_ATTEND_RECORD =
  '/api/attend-records?populate[0]=profile.user.role&populate[1]=records.admin.user.role&populate[2]=profile.profilePic&populate[3]=profile.idImage';
export const GET_ATTEND_RECORD = (id: string) =>
  `/api/attend-records/${id}?populate[0]=profile.user.role&populate[1]=records.admin.user.role&populate[2]=profile.profilePic&populate[3]=profile.idImage`;
export const GET_ATTEND_RECORD_BY_USER_ID = (id: string) =>
  `/api/attend-records?populate[0]=profile.user.role&populate[1]=records.admin.user.role&filters[profile][id][$eq]=${id}&populate[2]=profile.profilePic&populate[3]=profile.idImage`;
export const GET_ATTEND_RECORDS =
  '/api/attend-records?populate[0]=profile.user.role&populate[1]=records.admin.user.role&populate[2]=profile.profilePic&populate[3]=profile.idImage';
export const ADD_ATTEND_RECORD = (id: string) =>
  `/api/attend-records/add/${id}?populate[0]=profile.user.role&populate[1]=records.admin.user.role&populate[2]=profile.profilePic&populate[3]=profile.idImage`;

// FEEDBACK FORM ENDPOINTS
export const NEW_FEEDBACK_FORM = '/api/feedback-forms';

// Upload util
export const UPLOAD = '/dashboard/api/upload';
export const AZURE_STORAGE = 'https://rakfscstorage.blob.core.windows.net';

const blobContainerName = process.env.NEXT_PUBLIC_SHARE_NAME;
const blobAccName = process.env.NEXT_PUBLIC_BLOB_NAME;

export const BLOB_STORAGE_URL = `https://${blobAccName}.blob.core.windows.net/${blobContainerName}`;

const dashboardEndpoint = process.env.NEXT_PUBLIC_DASHBOARD_API_URL;

// Attend ENDPOINTS
export const DASH_ATTEND_RECORD = `${dashboardEndpoint}/api/attend-record`;

// Ticket ENDPOINTS
export const GENERATE_TICKET_URL = `${dashboardEndpoint}/api/generate-ticket`;

// CERTIFICATE ENDPOINTS
export const GENERATE_CERT_URL = `${dashboardEndpoint}/api/certificate`;
export const GET_CERT_PNG = `${dashboardEndpoint}/api/certificate-png`;

export const XXS = `/api/messages?populate%5B0%5D=toUser.user&populate%5B1%5D=fromUser.user&sort=%3CscrIpt%3Ealert
  %281%29%3B%3C%2FscRipt%3E&pagination%5BpageSize%5D=100&filters%5B%24or%5D%5B0%5D%5BfromUser%5D%5Bid%5D%5B%24
  eq%5D=122&filters%5B%24or%5D%5B1%5D%5BtoUser%5D%5Bid%5D%5B%24eq%5D=122`;
