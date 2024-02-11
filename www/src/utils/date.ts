import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { isSameDay } from 'date-fns';
import { UserRoleEnum } from 'models/auth';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Dubai');

export const formatDate = (date: Date, format: string): string => {
  try {
    const _date = dayjs(date).format(format);
    return _date;
  } catch {
    return 'Time';
  }
};

export const DAY_1 = new Date(
  new Date('2023-10-30T05:00:00').toLocaleString('en', {
    timeZone: 'Asia/Dubai'
  })
);

export const DAY_2 = new Date(
  new Date('2023-10-31T05:00:00').toLocaleString('en', {
    timeZone: 'Asia/Dubai'
  })
);
export const DAY_3 = new Date(
  new Date('2023-11-01T05:00:00').toLocaleString('en', {
    timeZone: 'Asia/Dubai'
  })
);

export const dubaiDate = (dateStr: string): Date => {
  return new Date(
    new Date(dateStr).toLocaleString('en', {
      timeZone: 'Asia/Dubai'
    })
  );
};

// export const DAY_1 = new Date(
//   new Date('2023-10-25T09:00:00').toLocaleString('en', {
//     timeZone: 'Asia/Dubai',
//   }),
// );

// export const DAY_2 = new Date(
//   new Date('2023-10-26T09:00:00').toLocaleString('en', {
//     timeZone: 'Asia/Dubai',
//   }),
// );
// export const DAY_3 = new Date(
//   new Date('2023-10-27T09:00:00').toLocaleString('en', {
//     timeZone: 'Asia/Dubai',
//   }),
// );
