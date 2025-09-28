import { filesAPI } from '../services/files.api';
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
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
} from "../store/actions/socket.actions";
import { TelegramUser } from "../types/types";

export const useSocketRedux = () => {
  const dispatch = useAppDispatch();
  const {
    isConnected: isConnectedSocket,
    connectionError,
    lastPong,
  } = useAppSelector((state) => state.socket);

  const connect = useCallback(
    (serverUrl: string, user: TelegramUser, chatId: string) => {
      dispatch(socketConnect({ serverUrl, user, chatId }));
    },
    [dispatch]
  );

  const disconnect = useCallback(() => {
    dispatch(socketDisconnect());
  }, [dispatch]);

  const joinChat = useCallback(
    (chatId: string, user: TelegramUser) => {
      dispatch(socketJoinChat({ chatId, user }));
    },
    [dispatch]
  );

  const leaveChat = useCallback(
    (chatId: string, user?: TelegramUser) => {
      dispatch(socketLeaveChat({ chatId, user }));
    },
    [dispatch]
  );

  const sendMessage = useCallback(
    (
      chatId: string,
      replyToMessageId: string | null,
      text: string,
      user: TelegramUser
    ) => {
      const message = {
        text: text.trim(),
        user: user,
        type: "text" as const,
        isPinned: false,
        replyTo: replyToMessageId ? replyToMessageId : null,
      };
      dispatch(socketSendMessage({ chatId, message }));
    },
    [dispatch]
  );

  const editMessage = useCallback(
    (chatId: string, id: string, text: string) => {
      const message = {
        id,
        text: text.trim(),
      };
      dispatch(socketEditMessage({ chatId, message }));
    },
    [dispatch]
  );

  const pinMessage = useCallback(
    (chatId: string, id: string) => {
      const message = {
        id: id,
      };
      dispatch(socketPinMessage({ chatId, message }));
    },
    [dispatch]
  );

  const unPinMessage = useCallback(
    (chatId: string, id: string) => {
      const message = {
        id: id,
      };
      dispatch(socketUnPinMessage({ chatId, message }));
    },
    [dispatch]
  );

  const deleteMessage = useCallback(
    (chatId: string, messageId: string) => {
      dispatch(socketDeleteMessage({ chatId, messageId }));
    },
    [dispatch]
  );

  const deleteAllMessages = useCallback(
    (chatId: string) => {
      dispatch(socketDeleteAllMessages(chatId));
    },
    [dispatch]
  );

  const banUser = useCallback(
    (user: TelegramUser) => {
      console.log("Dispatching banUser action for:", user.id); // Добавьте этот лог
      dispatch(socketBanUser({ userId: user.id }));
    },
    [dispatch]
  );

  const unbanUser = useCallback(
    (user: TelegramUser) => {
      dispatch(socketUnbanUser({ userId: user.id }));
    },
    [dispatch]
  );

  const setAdmin = useCallback(
    (user: TelegramUser) => {
      console.log("Dispatching banUser action for:", user.id); // Добавьте этот лог
      dispatch(socketSetAdmin({ userId: user.id }));
    },
    [dispatch]
  );

  const deleteAdmin = useCallback(
    (user: TelegramUser) => {
      dispatch(socketDeleteAdmin({ userId: user.id }));
    },
    [dispatch]
  );

  const sendMessageWithFiles = useCallback(async (
    chatId: string,
    replyToMessageId: string | null,
    text: string,
    user: TelegramUser,
    files: File[],
    onProgress?: (fileIndex: number, percent: number) => void
  ) => {
    try {
      const uploadedFiles = await filesAPI.uploadFiles(files, onProgress);
      
      const attachment = uploadedFiles.length > 0 ? {
        id: uploadedFiles[0].id,
        originalName: uploadedFiles[0].originalName,
        filename: uploadedFiles[0].filename,
        url: uploadedFiles[0].url,
        thumbnailUrl: uploadedFiles[0].thumbnailUrl,
        mimetype: uploadedFiles[0].mimetype,
        size: uploadedFiles[0].size,
        uploadedAt: uploadedFiles[0].uploadedAt,
      } : null;

      const message = {
        text: text.trim(),
        user: user,
        type: 'text' as const,
        isPinned: false,
        replyTo: replyToMessageId,
        attachment: attachment,
      };

      dispatch(socketSendMessage({ chatId, message }));
      
    } catch (error) {
      console.error('File upload failed:', error);
      // Fallback: send message without attachment
      const message = {
        text: text.trim() || 'File upload failed',
        user: user,
        type: 'text' as const,
        isPinned: false,
        replyTo: replyToMessageId,
        attachment: null,
      };
      dispatch(socketSendMessage({ chatId, message }));
    }
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
    sendMessageWithFiles,
    banUser,
    unbanUser,
    setAdmin,
    deleteAdmin,
    ping,
  };
};
