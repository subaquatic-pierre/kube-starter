import { UserProfile } from 'models/auth';
import { Message } from 'models/message';

export interface ChatHistory {
  fromId: number;
  toId: number;
  id?: number;
  from?: string;
  to?: string;
  text: string | React.ReactElement;
  time?: string;
}

export interface ChatStateProps {
  chats: Message[];
  user: UserProfile;
  users: UserProfile[];
  error: object | string | null;
}
