import { UserProfile, UserProfileStatus } from 'models/auth';

export function dec2hex(dec: number) {
  return dec.toString(16).padStart(2, '0');
}

// generateId :: Integer -> String
export function generateId(len?: number) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}

export function getProfileStatus(profile: UserProfile): UserProfileStatus {
  if (profile.rejected) {
    return 'rejected';
  }
  if (!profile.profileCompleted) {
    return 'incomplete';
  }
  if (profile.profileCompleted && !profile.attendanceConfirmed) {
    return 'pending';
  }

  if (profile.profileCompleted && profile.attendanceConfirmed) {
    return 'confirmed';
  }

  return 'unknown';
}

export const getNameOnCert = (profile: Partial<UserProfile>): string => {
  if (profile.nameOnCert) {
    return profile.nameOnCert;
  }

  const { firstName, middleName, lastName } = profile;

  if (firstName && middleName && lastName) {
    return `${firstName} ${middleName} ${lastName}`;
  }

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  if (firstName) {
    return `${firstName}`;
  }

  return '';
};

export const getKeywords = (str: string): string[] => {
  if (str === '') {
    return [];
  }
  return str.split(',');
};
