import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chat.slice';
import getAvatarColorReducer from './slices/avatar.slice';
import socketReducer from './slices/socket.slice';
import { socketMiddleware } from './middleware/socketMiddleware';
import { getAvatarColorSlice } from './slices/avatar.slice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    socket: socketReducer,
    avatarColor: getAvatarColorReducer, // Добавляем редюсер для цвета аватара
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем socket actions, так как они могут содержать несериализуемые данные
        ignoredActions: [
          'socket/connect',
          'socket/messageReceived',
          'socket/userJoined',
          'socket/userLeft',
          'socket/error',
        ],
      },
    }).concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;