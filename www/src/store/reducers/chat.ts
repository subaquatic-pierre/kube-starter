// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// types
import { ChatStateProps } from 'types/chat';
import { apiReqWithAuth } from 'lib/api';
import { UserProfile } from 'models/auth';
import { blankProfile, blankUser } from 'utils/blankData';
import { Message, reduceMessage, reduceMessages } from 'models/message';

import { CREATE_MESSAGE, GET_MESSAGES, GET_USERS, GET_ADMINS } from 'lib/endpoints';

// ==============================|| SLICE - CHAT||============================== //

const initialState: ChatStateProps = {
  error: null,
  chats: [],
  user: blankProfile as UserProfile,
  users: []
};

const chat = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET USER
    getUserSuccess(state, action) {
      state.user = action.payload;
    },

    // GET USER CHATS
    getUserChatsSuccess(state, action) {
      state.chats = action.payload;
    },

    // GET USERS
    getUsersSuccess(state, action) {
      const newUsers: UserProfile[] = [];
      for (const user of action.payload) {
        if (state.users.findIndex((el) => el.id === user.id) === -1) {
          newUsers.push(user);
        }
      }

      const users = [...state.users, ...newUsers];
      // sort in place
      sortUsers(users);
      state.users = users;
    },

    addUserSuccess(state, action) {
      const newUser = action.payload;
      const newUsers: UserProfile[] = [];
      if (state.users.findIndex((el) => el.id === newUser.id) === -1) {
        newUsers.push(action.payload);
      }

      const users = [...state.users, ...newUsers];
      // sort in place
      sortUsers(users);

      state.users = users;
    },

    // ADD NEW MESSAGE TO CHAT
    insertMessageSuccess(state, action) {
      state.chats = [...state.chats, action.payload];
      // state.users = action.payload;
    }
  }
});

// Reducer
export default chat.reducer;

// ==============================|| CHAT - API CALL ||============================== //

const sortUsers = (users: UserProfile[]) => {
  // sort alphabetical
  users.sort((a, b) => (a.firstName > b.firstName ? -1 : 1));
  // Sort contact user with id always first user
  users.sort((el) => (el.id === 0 ? -1 : 1));
};

const removeAdminsFromUsers = async (users: UserProfile[]) => {
  const res = await apiReqWithAuth<{
    data: {
      superAdmins: UserProfile[];
      memberAdmins: UserProfile[];
      authorAdmins: UserProfile[];
    };
  }>({
    endpoint: GET_ADMINS,
    method: 'GET'
  });

  const adminIds = [];

  res.data.data.superAdmins.forEach((admin) => adminIds.push(admin.id));
  res.data.data.memberAdmins.forEach((admin) => adminIds.push(admin.id));
  res.data.data.authorAdmins.forEach((admin) => adminIds.push(admin.id));

  const filtered = [];

  for (const user of users) {
    if (adminIds.indexOf(user.id) === -1) {
      filtered.push(user);
    }
  }

  return filtered;
};

const getUsersFromMessages = (messages: Message[]): UserProfile[] => {
  const users: UserProfile[] = [];

  // Add contact user first
  users.push(blankProfile);

  for (const message of messages) {
    if (message.isContactMessage || !message.fromUser) {
      continue;
    } else {
      users.push(message.fromUser);
      users.push(message.toUser);
    }
  }

  const filtered = users.filter((value, index, self) => index === self.findIndex((t) => t.id === value.id));

  return filtered;
};

export function getAllMessages(endpoint = GET_MESSAGES) {
  return async () => {
    const res = await apiReqWithAuth({
      endpoint: endpoint,
      method: 'GET'
    });

    const messages = reduceMessages(res);

    try {
      if (res.error) {
        dispatch(chat.actions.hasError('There was an error fetching all messages'));
      } else {
        dispatch(chat.actions.getUserChatsSuccess(messages));
      }
    } catch (e) {
      dispatch(chat.actions.hasError('There was an error fetching all messages'));
    }
  };
}

export function insertChat(fromUserId: number, toUserId: number, content: string, dummyMsg?: Message) {
  return async () => {
    // if is dummy message only append to state, no api call
    if (dummyMsg) {
      dispatch(chat.actions.insertMessageSuccess(dummyMsg));
    } else {
      // TODO: send strapi request for new message
      const data = {
        content,
        isContactMessage: false,
        fromUser: fromUserId,
        toUser: toUserId
      };
      const res = await apiReqWithAuth<{ data: any }>({
        endpoint: CREATE_MESSAGE,
        method: 'POST',
        data: { data }
      });

      try {
        const message = reduceMessage(res.data.data);
        if (res.error) {
          dispatch(chat.actions.hasError('There was an error inserting chat message'));
        } else {
          dispatch(chat.actions.insertMessageSuccess(message));
        }
      } catch (e) {
        dispatch(chat.actions.hasError('There was an error inserting chat message'));
      }
    }
  };
}

export function getUsers() {
  return async () => {
    const res = await apiReqWithAuth({
      endpoint: GET_MESSAGES,
      method: 'GET'
    });

    if (res.error) {
      dispatch(chat.actions.hasError('There was an error getting Users'));
    } else {
      try {
        const messages = reduceMessages(res);
        const allUsers = getUsersFromMessages(messages);
        const users = await removeAdminsFromUsers(allUsers);

        dispatch(chat.actions.getUsersSuccess(users));
      } catch {
        dispatch(chat.actions.getUsersSuccess([]));
      }
    }
  };
}

export function addUser(user: UserProfile) {
  return async () => {
    try {
      dispatch(chat.actions.addUserSuccess(user));
    } catch {
      dispatch(chat.actions.hasError('Unable to add user'));
    }
  };
}
