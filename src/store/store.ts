import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chat.slice';
import getAvatarColorReducer from './slices/avatar.slice';
import socketReducer from './slices/socket.slice';
import contextMenuReducer from './slices/contextMenu.slice';
import { socketMiddleware } from './middleware/socketMiddleware';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    socket: socketReducer,
    avatarColor: getAvatarColorReducer,
    contextMenu: contextMenuReducer // Добавляем редюсер для цвета аватара
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем socket actions, так как они могут содержать несериализуемые данные
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