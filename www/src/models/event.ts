import { UserProfile } from './auth';

export type AgendaEvent = {
  title: string;
  category: string;
  description: string;
  color: string;
  textColor: string;
  allDay: boolean;
  start: Date;
  end: Date;
  speaker: UserProfile | number;
  hall?: string | null;
};
