import axios from 'axios';
import { GENERATE_CERT_URL } from './endpoints';
import { DashboardApiResponse } from 'types/api';
import { AttendRecord } from 'models/record';
import { UserProfile, UserRoleEnum } from 'models/auth';
import { DAY_1, DAY_2, DAY_3, dubaiDate } from 'utils/date';
import { isSameDay } from 'date-fns';

export interface VisitorText {
  day1?: 'online' | 'in-person';
  day2?: 'online' | 'in-person';
  day3?: 'online' | 'in-person';
}

export type CertType = 'online' | 'in-person' | 'workshop' | UserRoleEnum;

export interface CertGenData {
  nameOnCert: string;
  email: string;
  status: 'generated' | 'pending';
  role: UserRoleEnum;
  institution: string;
  record: AttendRecord;
  type: CertType;
  profile: Partial<UserProfile>;
  visitorText?: VisitorText;
}

const ticketGenSecret = process.env.NEXT_PUBLIC_TICKET_GEN_SECRET;

export const generateCertificate = async (certGenData: CertGenData) => {
  try {
    const res = await axios.request<any, DashboardApiResponse>({
      method: 'POST',
      url: GENERATE_CERT_URL,
      data: {
        secret: ticketGenSecret,
        recordId: certGenData.record.id,
        profileId: certGenData.profile.id,
        nameOnCert: certGenData.nameOnCert,
        certType: certGenData.type,
        visitorText: certGenData.visitorText ?? {},
      },
    });

    return res.data.data;
  } catch (e: any) {
    return {
      error: { message: `${e}` },
    };
  }
};

export const getInPersonCertData = (records: AttendRecord[]): CertGenData[] => {
  const certData: CertGenData[] = [];

  for (const record of records) {
    for (const recordItem of record.records) {
      if (
        recordItem.type !== 'online' &&
        record.profile.user.role.type !== 'speaker'
      ) {
        const item: CertGenData = {
          nameOnCert: record.profile.nameOnCert,
          email: record.profile.email,
          role: record.profile.user.role.type,
          status: 'pending',
          institution: record.profile.institution,
          profile: record.profile,
          record: record,
          type: 'in-person',
        };
        certData.push(item);
      }
      break;
    }
  }

  return certData;
};
export const getSpeakerCertData = (
  records: AttendRecord[],
  allUsers: UserProfile[],
): CertGenData[] => {
  const certData: CertGenData[] = [];

  for (const record of records) {
    if (record.profile.user.role.type === 'speaker') {
      const item: CertGenData = buildCertGenData(record, 'speaker');
      certData.push(item);
    }
  }

  certData.sort((a, b) => (a.profile.order < b.profile.order ? -1 : 1));

  return certData;
};
export const getWorkshopCertData = (records: AttendRecord[]): CertGenData[] => {
  const certData: CertGenData[] = [];

  return certData;
};

export const getOnlineCertData = (records: AttendRecord[]): CertGenData[] => {
  const certData: CertGenData[] = [];

  for (const record of records) {
    for (const recordItem of record.records) {
      if (
        recordItem.type === 'online' &&
        record.profile.user.role.type !== 'speaker'
      ) {
        const item: CertGenData = {
          nameOnCert: record.profile.nameOnCert,
          email: record.profile.email,
          role: record.profile.user.role.type,
          status: 'pending',
          institution: record.profile.institution,
          profile: record.profile,
          record: record,
          type: 'in-person',
        };
        certData.push(item);
      }
      break;
    }
  }

  return certData;
};

export const getVisitorTextFromRecord = (record: AttendRecord): VisitorText => {
  const text: VisitorText = {
    day1: null,
    day2: null,
    day3: null,
  };

  // only
  for (const item of record.records) {
    // only update the text key for given day
    // if key does not already exist or is not 'in-person'
    // ie. looping through record items may be
    // online attend record in which case that record
    // should be over written with the in-person record

    // item.type could be 'in-person' or 'online' or 'null'
    // in the case which it is 'null' then add value of 'in-person'
    // to text, may be 'null' only because late addition to model
    if (isSameDay(DAY_1, item.time) && text.day1 !== 'in-person') {
      text.day1 = item.type ?? 'in-person';
    }
    if (isSameDay(DAY_2, item.time) && text.day2 !== 'in-person') {
      text.day2 = item.type ?? 'in-person';
    }
    if (isSameDay(DAY_3, item.time) && text.day3 !== 'in-person') {
      text.day3 = item.type ?? 'in-person';
    }
  }

  return text;
};

export const buildCertGenData = (
  record: AttendRecord,
  type: CertType,
): CertGenData => {
  const { profile } = record;
  let nameOnCert = profile.nameOnCert;

  // if not speaker, update name on cert to be taken
  // from profile name fields, also remove any additional white
  // space from names, leaving only single white space,
  // also trim all white space from front and back of text
  if (type !== 'speaker') {
    const names: string[] = [];
    if (profile.title) {
      names.push(profile.title.replace(/\s\s+/g, ' ').trim());
    }
    if (profile.firstName) {
      names.push(profile.firstName.replace(/\s\s+/g, ' ').trim());
    }
    if (profile.middleName) {
      names.push(profile.middleName.replace(/\s\s+/g, ' ').trim());
    }
    if (profile.lastName) {
      names.push(profile.lastName.replace(/\s\s+/g, ' ').trim());
    }

    nameOnCert = names.join(' ');
  }

  return {
    nameOnCert,
    email: record.profile.email,
    role: record.profile.user.role.type,
    status: 'pending',
    institution: record.profile.institution,
    profile: record.profile,
    record: record,
    type,
    visitorText: getVisitorTextFromRecord(record),
  };
};
