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

export const socketEditMessage = createAction<{
  chatId: string;
  message: Omit<Message, 'timestamp' |  'user' | 'type' |'isPinned' >;
}>('socket/editMessage');

export const socketPinMessage = createAction<{
  chatId: string;
  message: Omit<Message, 'user' | 'timestamp' | 'type' |'isPinned' | 'text'>;
}>('socket/pinMessage');

export const socketUnPinMessage = createAction<{
  chatId: string;
  message: Omit<Message, 'user' | 'timestamp' | 'type' |'isPinned' | 'text'>;
}>('socket/unPinMessage');

export const socketDeleteMessage = createAction<{
  chatId: string;
  messageId: string;
}>('socket/deleteMessage');

export const socketBanUser = createAction<{
  userId: number;
}>('socket/banUser');

export const socketUnbanUser = createAction<{
  userId: number;
}>('socket/unBanUser');

export const socketSetAdmin = createAction<{
  userId: number;
}>('socket/setAdmin');

export const socketDeleteAdmin = createAction<{
  userId: number;
}>('socket/deleteAdmin');

export const socketDeleteAllMessages = createAction<string>('socket/deleteAllMessages');

export const socketPing = createAction('socket/ping');

export const socketConnected = createAction('socket/connected');
export const socketDisconnected = createAction<string>('socket/disconnected');
export const socketMessageReceived = createAction<Message>('socket/messageReceived');
export const socketMessagePinned = createAction<Message>('socket/messagePinned');
export const socketMessageUnPinned = createAction<Message>('socket/messageUnPinned');
export const socketUserJoined = createAction<Message>('socket/userJoined');
export const socketUserLeft = createAction<Message>('socket/userLeft');
export const socketError = createAction<any>('socket/error');
export const socketPongReceived = createAction('socket/pongReceived');