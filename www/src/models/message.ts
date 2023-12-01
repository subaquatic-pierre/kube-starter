import { UserProfile } from './auth';
import { FileUpload } from './file';

export type Message = {
  id: number;
  content: string;
  fromUser: UserProfile;
  fullName: string;
  toUser: UserProfile;
  isContactMessage: boolean;
  contactEmail?: string;
  toUserRead: boolean;
  fromUserRead: boolean;
  attachement?: FileUpload;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const reduceMessage = (data: any): Message | null => {
  try {
    // const role = data.attributes.fromUser.data.user.role;

    let message: Message = {
      id: data.id,
      ...data.attributes,
      toUser: {
        id: data.attributes.toUser.data.id,
        ...data.attributes.toUser.data.attributes,
      },
      ...(data.attributes.fromUser.data
        ? {
            fromUser: {
              id: data.attributes.fromUser.data.id,
              ...data.attributes.fromUser.data.attributes,
            },
          }
        : {
            fromUser: {
              id: 0,
              firstName: 'Contact',
              lastName: 'Message',
            },
          }),
      ...(data.attributes.toUser.data
        ? {
            toUser: {
              id: data.attributes.toUser.data.id,
              ...data.attributes.toUser.data.attributes,
            },
          }
        : {
            toUser: {
              id: 0,
              firstName: 'Contact',
              lastName: 'Message',
            },
          }),
    };

    if (data.attributes.fromUser.data) {
      const role =
        data.attributes.fromUser.data.attributes.user.data.attributes.role.data
          .attributes;

      message.fromUser.user.role = role;
    }
    if (data.attributes.toUser.data) {
      const role =
        data.attributes.toUser.data.attributes.user.data.attributes.role.data
          .attributes;

      message.toUser.user.role = role;
    }

    return message;
  } catch (e) {
    console.debug('Error reducing message');
    return null;
  }
};

export const reduceMessages = (data: any): Message[] => {
  try {
    const messages = [];
    for (const item of data.data.data) {
      const log = reduceMessage(item);

      if (log) messages.push(log);
    }
    // sort messages oldest to newest
    messages.sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      return aDate > bDate ? 1 : -1;
    });

    return messages;
  } catch (e: any) {
    console.debug(e);
    return [];
  }
};

export const removeAdminMessages = (messages: Message[]): Message[] => {
  const returnMsgs = [];

  for (const msg of messages) {
    if (msg.isContactMessage) {
      returnMsgs.push(msg);
      continue;
    }
    try {
      const fromUserRole = msg.fromUser.user.role.type;

      if (
        fromUserRole !== 'admin' &&
        fromUserRole !== 'member' &&
        fromUserRole !== 'author' &&
        fromUserRole !== 'organizer'
      ) {
        returnMsgs.push(msg);
      }
    } catch (e) {
      // returnMsgs.push(msg);

      console.debug('Error removing admins messages');
      continue;
    }
  }

  return returnMsgs;
};
