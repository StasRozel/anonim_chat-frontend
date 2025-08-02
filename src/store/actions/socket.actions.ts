import { createAction } from '@reduxjs/toolkit';
import { Message, TelegramUser } from '../../types/types';

export const socketConnect = createAction<{
  serverUrl: string;
  user: TelegramUser;
  chatId: string;
}>('socket/connect');

export const socketDisconnect = createAction('socket/disconnect');

export const socketJoinChat = createAction<{
  chatId: string;
  user: TelegramUser;
}>('socket/joinChat');

export const socketLeaveChat = createAction<{
  chatId: string;
  user?: TelegramUser;
}>('socket/leaveChat');

export const socketSendMessage = createAction<{
  chatId: string;
  message: Omit<Message, 'id' | 'timestamp'>;
}>('socket/sendMessage');

export const socketPinMessage = createAction<{
  chatId: string;
  message: Omit<Message, 'user' | 'timestamp' | 'type' |'isPinned' | 'text'>;
}>('socket/pinMessage');

export const socketPing = createAction('socket/ping');

export const socketConnected = createAction('socket/connected');
export const socketDisconnected = createAction<string>('socket/disconnected');
export const socketMessageReceived = createAction<Message>('socket/messageReceived');
export const socketMessagePinned = createAction<Message>('socket/messagePinned');
export const socketUserJoined = createAction<Message>('socket/userJoined');
export const socketUserLeft = createAction<Message>('socket/userLeft');
export const socketError = createAction<any>('socket/error');
export const socketPongReceived = createAction('socket/pongReceived');