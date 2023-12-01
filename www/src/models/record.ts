import { AttendType } from 'lib/attend';
import { UserProfile } from './auth';
import { dubaiDate } from 'utils/date';

export interface AttendRecord {
  id: number;
  profile: Partial<UserProfile>;
  onlineCertUrl: string | null;
  inPersonCertUrl: string | null;
  workshopCertUrl: string | null;
  records: {
    id: number;
    admin: Partial<UserProfile>;
    location: string;
    time: Date;
    type: AttendType;
  }[];
}

export const reduceAttendRecord = (data: any): AttendRecord | null => {
  try {
    // const role = data.attributes.fromUser.data.user.role;

    const copy = { ...data };
    const record = {
      id: data.id,
      ...data.attributes,
    };

    if (
      record.profile &&
      record.profile.data &&
      record.profile.data.attributes.user
    ) {
      record.profile = {
        id: record.profile.data.id,
        ...record.profile.data.attributes,
      };

      record.profile.user = {
        id: record.profile.user.data.id,
        ...record.profile.user.data.attributes,
        role: {
          id: copy.attributes.profile.data.attributes.user.data.attributes.role
            .data.id,
          ...copy.attributes.profile.data.attributes.user.data.attributes.role
            .data.attributes,
        },
      };
    }

    if (Array.isArray(record.records)) {
      for (let i = 0; i < record.records.length; i++) {
        const reducedItem = { ...record.records[i] };
        const copy = { ...record.records[i] };

        reducedItem.admin = {
          id: reducedItem.admin.data.id,
          ...reducedItem.admin.data.attributes,
          role: {
            id: copy.admin.data.attributes.user.data.attributes.role.data.id,
            ...copy.admin.data.attributes.user.data.attributes.role.data
              .attributes,
          },
        };

        reducedItem.time = dubaiDate(copy.time);

        record.records[i] = reducedItem;
      }
    }

    return record;
  } catch (e) {
    console.debug('Error reducing attend record');
    return null;
  }
};

export const reduceAttendRecords = (data: any): AttendRecord[] => {
  try {
    const records = [];
    for (const item of data.data.data) {
      const record = reduceAttendRecord(item);

      if (record) records.push(record);
    }
    return records;
  } catch (e: any) {
    console.debug(e);
    return [];
  }
};
