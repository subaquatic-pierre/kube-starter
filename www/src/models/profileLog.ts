import { UserProfile } from './auth';

export type ProfileLog = {
  id: number;
  time: Date;
  data: Object;
  admin: UserProfile;
  profile: UserProfile;
  type: string;
};

const reduceProfileLog = (data: any): ProfileLog => {
  const log = {
    id: data.id,
    ...data.attributes,
    admin: {
      id: data.attributes.admin.data.id,
      ...data.attributes.admin.data.attributes,
    },
    profile: {
      id: data.attributes.profile.data.id,
      ...data.attributes.profile.data.attributes,
    },
  };
  return log;
};

export const reduceProfileLogs = (data: any): ProfileLog[] => {
  try {
    const logs = [];
    for (const item of data.data.data) {
      const log = reduceProfileLog(item);
      logs.push(log);
    }
    return logs;
  } catch (e: any) {
    console.log(e);
    return [];
  }
};
