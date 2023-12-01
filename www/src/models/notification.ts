import { UserProfile } from './auth';

export type NotificationType =
  | 'profileComplete'
  | 'newAbstract'
  | 'profileUpdate'
  | 'userRegister';

export type Notification = {
  id: number;
  toUser: UserProfile;
  fromUser: UserProfile;
  type: NotificationType;
  content: string;
  time: Date;
  data: any;
  fromUserRead: boolean;
  toUserRead: boolean;
};

export const reduceNotification = (data: any): Notification | null => {
  try {
    const notification = {
      id: data.id,
      ...data.attributes,
      toUser: {
        id: data.attributes.toUser.data.id,
        ...data.attributes.toUser.data.attributes,
      },
      fromUser: {
        id: data.attributes.fromUser.data.id,
        ...data.attributes.fromUser.data.attributes,
      },
    };

    if (data.attributes.fromUser.data) {
      const role =
        data.attributes.fromUser.data.attributes.user.data.attributes.role.data
          .attributes;

      notification.fromUser.user.role = role;
    }
    if (data.attributes.toUser.data) {
      const role =
        data.attributes.toUser.data.attributes.user.data.attributes.role.data
          .attributes;

      notification.toUser.user.role = role;
    }

    return notification;
  } catch (e) {
    return null;
  }
};

export const reduceNotifications = (data: any): Notification[] => {
  try {
    const notifications = [];
    for (const item of data.data.data) {
      const log = reduceNotification(item);
      if (log) notifications.push(log);
    }
    return notifications;
  } catch (e: any) {
    console.log(e);
    return [];
  }
};
