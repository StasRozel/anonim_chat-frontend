import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  socketConnect,
  socketDisconnect,
  socketJoinChat,
  socketLeaveChat,
  socketSendMessage,
  socketPing,
} from '../store/actions/socket.actions';
import { TelegramUser } from '../types/types';

export const useSocketRedux = () => {
  const dispatch = useAppDispatch();
  const { isConnected: isConnectedSocket, connectionError, lastPong } = useAppSelector(
    (state) => state.socket
  );

  const connect = useCallback((serverUrl: string, user: TelegramUser, chatId: string) => {
    dispatch(socketConnect({ serverUrl, user, chatId }));
  }, [dispatch]);

  const disconnect = useCallback(() => {
    dispatch(socketDisconnect());
  }, [dispatch]);

  const joinChat = useCallback((chatId: string, user: TelegramUser) => {
    dispatch(socketJoinChat({ chatId, user }));
  }, [dispatch]);

  const leaveChat = useCallback((chatId: string, user?: TelegramUser) => {
    dispatch(socketLeaveChat({ chatId, user }));
  }, [dispatch]);

  const sendMessage = useCallback((chatId: string, text: string, user: TelegramUser) => {
    const message = {
      text: text.trim(),
      user: user,
      type: 'text' as const,
    };
    dispatch(socketSendMessage({ chatId, message }));
  }, [dispatch]);

  const ping = useCallback(() => {
    dispatch(socketPing());
  }, [dispatch]);

  return {
    // Состояние
    isConnectedSocket,
    connectionError,
    lastPong,
    
    // Действия
    connect,
    disconnect,
    joinChat,
    leaveChat,
    sendMessage,
    ping,
  };
};