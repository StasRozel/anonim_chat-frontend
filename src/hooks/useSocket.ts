import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  socketConnect,
  socketDisconnect,
  socketJoinChat,
  socketLeaveChat,
  socketSendMessage,
  socketPing,
  socketPinMessage,
  socketUnPinMessage,
  socketDeleteMessage,
  socketDeleteAllMessages,
  socketEditMessage,
  socketBanUser,
  socketUnbanUser,
  socketSetAdmin,
  socketDeleteAdmin,
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

  const sendMessage = useCallback((chatId: string, replyToMessageId: string | null, text: string, user: TelegramUser) => {
    const message = {
      text: text.trim(),
      user: user,
      type: 'text' as const,
      isPinned: false,
      replyTo: replyToMessageId ?  replyToMessageId : null, 
    };
    dispatch(socketSendMessage({ chatId, message }));
  }, [dispatch]);

  const editMessage = useCallback((chatId: string, id: string, text: string) => {
    const message = {
      id,
      text: text.trim(),
    };
    dispatch(socketEditMessage({ chatId, message }));
  }, [dispatch]);

  const pinMessage = useCallback((chatId: string, id: string) => {
    const message = {
      id: id,
    };
    dispatch(socketPinMessage({chatId, message}));
  }, [dispatch]);

  const unPinMessage = useCallback((chatId: string, id: string) => {
    const message = {
      id: id,
    };
    dispatch(socketUnPinMessage({chatId, message}));
  }, [dispatch]);

  const deleteMessage = useCallback((chatId: string, messageId: string) => {
    dispatch(socketDeleteMessage({chatId, messageId}));
  }, [dispatch]);

  const deleteAllMessages = useCallback((chatId: string) => {
    dispatch(socketDeleteAllMessages(chatId));
  }, [dispatch]);

  const banUser = useCallback((user: TelegramUser) => {
    console.log("Dispatching banUser action for:", user.id); // Добавьте этот лог
    dispatch(socketBanUser({ userId: user.id  }));
  }, [dispatch]);

  const unbanUser = useCallback((user: TelegramUser) => {
    dispatch(socketUnbanUser({ userId: user.id }));
  }, [dispatch]);

  const setAdmin = useCallback((user: TelegramUser) => {
    console.log("Dispatching banUser action for:", user.id); // Добавьте этот лог
    dispatch(socketSetAdmin({ userId: user.id  }));
  }, [dispatch]);

  const deleteAdmin = useCallback((user: TelegramUser) => {
    dispatch(socketDeleteAdmin({ userId: user.id }));
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
    editMessage,
    pinMessage,
    unPinMessage,
    deleteMessage,
    deleteAllMessages,
    banUser,
    unbanUser,
    setAdmin,
    deleteAdmin,
    ping,
  };
};