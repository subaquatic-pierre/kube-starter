import add from 'date-fns/add';
import isSameDay from 'date-fns/isSameDay';

export const DAY_1 = new Date('2023-10-30T14:23');
export const DAY_2 = new Date('2023-10-31');
export const DAY_3 = new Date('2023-11-01');

export const getDateByDay = (dayNumber: number): Date | null => {
  if (dayNumber === 1) {
    return DAY_1;
  } else if (dayNumber === 2) {
    return DAY_2;
  } else if (dayNumber === 3) {
    return DAY_3;
  }

  return null;
};

// TODO: change getToday to actual day, ie. return new Date();
export const getToday = (): Date => {
  return DAY_1;
  // return new Date();
};

export const getDayByDate = (date: Date): number | null => {
  if (isSameDay(getDateByDay(1), date)) {
    return 1;
  } else if (isSameDay(getDateByDay(2), date)) {
    return 2;
  } else if (isSameDay(getDateByDay(2), date)) {
    return 3;
  }
  return null;
};

export const addDays = (date: Date, numDays: number): Date => {
  return add(date, { days: numDays });
};

export const getCheckInKey = (date: Date): string | null => {
  const day = getDayByDate(date);
  if (!day) {
    return null;
  }
  return `day${day}CheckIn`;
};

export const getDayLabelByDate = (date: Date): string | null => {
  if (isSameDay(getDateByDay(1), date)) {
    return 'Day 1';
  } else if (isSameDay(getDateByDay(2), date)) {
    return 'Day 2';
  } else if (isSameDay(getDateByDay(3), date)) {
    return 'Day 3';
  }
};
export const getDayLabelByDay = (dayNumber: number): string | null => {
  if (dayNumber === 1) {
    return 'Day 1';
  } else if (dayNumber === 2) {
    return 'Day 2';
  } else if (dayNumber === 3) {
    return 'Day 3';
  }
};
