import axios from 'axios';
import { DASH_ATTEND_RECORD, GET_ATTEND_RECORD_BY_USER_ID } from './endpoints';
import { DashboardApiResponse } from 'types/api';
import { GET_ATTEND_RECORD } from './endpoints';
import { strapiReqWithAuth } from './api';
import { AttendRecord } from 'models/record';
import { isSameDay } from 'date-fns';
import { UserProfile, UserRoleEnum } from 'models/auth';
import { indexOf } from 'lodash';

const ticketGenSecret = process.env.NEXT_PUBLIC_TICKET_GEN_SECRET;

export type AttendType = 'online' | 'in-person' | null;

export const newAttendRecord = async (
  profileId: number,
  adminId: number,
  location: string,
  type: AttendType = 'in-person',
) => {
  try {
    const token = window.localStorage.getItem('token');
    const res = await axios.request<any, DashboardApiResponse>({
      method: 'POST',
      url: DASH_ATTEND_RECORD,
      data: {
        jwt: token,
        secret: ticketGenSecret,
        profileId,
        newRecord: {
          location,
          adminId,
          type,
        },
      },
    });

    return res.data;
  } catch (e: any) {
    return {
      error: { message: `${e}` },
    };
  }
};

export const addAttendRecordItem = async (
  recordId: number,
  location: string,
  adminId: number,
  profileId: number,
  type: AttendType = 'in-person',
) => {
  try {
    const token = window.localStorage.getItem('token');
    const res = await axios.request<any, DashboardApiResponse>({
      method: 'PUT',
      url: DASH_ATTEND_RECORD,
      data: {
        jwt: token,
        secret: ticketGenSecret,
        recordId,
        location,
        adminId,
        profileId,
        type,
      },
    });

    return res.data;
  } catch (e: any) {
    return {
      error: { message: `${e}` },
    };
  }
};

export const updateAttendRecord = async (values: any, recordId: string) => {
  const updateRecordRes = await strapiReqWithAuth<any>({
    endpoint: GET_ATTEND_RECORD(recordId),
    method: 'PUT',
    data: { data: values },
  });

  if (updateRecordRes.error) {
    throw new Error(updateRecordRes.error.message);
  }

  return updateRecordRes;
};

export const getTotalAttend = (
  day: Date,
  allRecords: AttendRecord[],
  role: UserRoleEnum,
): number => {
  // loop over all records
  let totalCount = 0;
  for (const record of allRecords) {
    // loop over all record items
    if (record.profile.user.role.type === role) {
      for (const recordItem of record.records) {
        if (recordItem.type !== 'online') {
          // create local date for record item
          const itemDate = new Date(
            new Date(recordItem.time).toLocaleString('en', {
              timeZone: 'Asia/Dubai',
            }),
          );

          // check if record item date is dame as requested date
          // increment count
          // break out of this record loop, ie. may have other record items
          // with same day, only need first date that matches
          const dayMatched = isSameDay(day, itemDate);
          if (dayMatched) {
            totalCount += 1;
            break;
          }
        }
      }
    }
  }

  return totalCount;
};

export const getOnlineAttend = (
  day: Date,
  allRecords: AttendRecord[],
): number => {
  // loop over all records
  let totalCount = 0;
  for (const record of allRecords) {
    // loop over all record items
    for (const recordItem of record.records) {
      if (recordItem.type === 'online') {
        // create local date for record item
        const itemDate = new Date(
          new Date(recordItem.time).toLocaleString('en', {
            timeZone: 'Asia/Dubai',
          }),
        );

        // check if record item date is dame as requested date
        // increment count
        // break out of this record loop, ie. may have other record items
        // with same day, only need first date that matches
        const dayMatched = isSameDay(day, itemDate);
        if (dayMatched) {
          totalCount += 1;
          break;
        }
      }
    }
  }

  return totalCount;
};

const getCount = (profileIds: number[], profileId: number): number => {
  let count = 0;

  for (const id of profileIds) {
    if (id === profileId) {
      count += 1;
    }
  }

  return count;
};

export const getDuplicateRecords = (
  records: AttendRecord[],
): AttendRecord[] => {
  const profileIds = records.map((record) => record.profile.id);
  const duplicates = [];

  for (const record of records) {
    const count = getCount(profileIds, record.profile.id);
    if (count > 1) {
      duplicates.push(record);
    }
  }

  return duplicates;
};

export const generateAttendRecords = async (allUsers: UserProfile[]) => {
  const speakers: UserProfile[] = [];

  for (const profile of allUsers) {
    if (
      profile.user.role.type === 'speaker' &&
      profile.status === 'confirmed'
    ) {
      speakers.push(profile);
    }
  }

  const filtered = allUsers.filter(
    (user) => user.status === 'confirmed' && user.user.role.type === 'speaker',
  );

  console.log(speakers.length, filtered.length);

  for (const speaker of speakers) {
    // const record = await strapiReqWithAuth<any>({
    //   endpoint: GET_ATTEND_RECORD_BY_USER_ID(`${speaker.id}`),
    // });
    // if length record is zero, no record exists, then must create record
    // if (record && record.data && record.data.data.length === 0) {
    //   const res = await newAttendRecord(speaker.id, 10, 'Hall A');
    //   console.log(res);
    // }
  }

  // console.log(speakers);
};
