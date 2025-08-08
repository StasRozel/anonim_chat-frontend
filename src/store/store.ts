import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chat.slice';
import getAvatarColorReducer from './slices/avatar.slice';
import socketReducer from './slices/socket.slice';
import contextMenuReducer from './slices/contextMenu.slice';
import replyToReducer from './slices/replyTo.slice';
import { socketMiddleware } from './middleware/socketMiddleware';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    socket: socketReducer,
    avatarColor: getAvatarColorReducer,
    contextMenu: contextMenuReducer,
    replyTo: replyToReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'socket/connect',
          'socket/messageReceived',
          'socket/messagePinned',
          'socket/messageUnPinned',
          'socket/userJoined',
          'socket/userLeft',
          'socket/error',
        ],
      },
    }).concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;