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
  return 'unknown';
}

export const getKeywords = (str: string): string[] => {
  if (str === '') {
    return [];
  }
  return str.split(',');
};
