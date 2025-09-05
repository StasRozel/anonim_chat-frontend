import { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import {
  socketConnect,
  socketConnected,
  socketJoinChat,
  socketDisconnected,
  socketError,
  socketMessageReceived,
  socketUserJoined,
  socketUserLeft,
  socketPongReceived,
  socketDisconnect,
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
} from "../actions/socket.actions";
import {
  setConnectionStatus,
  addMessage,
  setMessages,
} from "../slices/chat.slice";
import {
  clearConnectionError,
  setConnectionError,
  setPong,
} from "../slices/socket.slice";
import { chatAPI } from "../../services/api";
import { updUser } from "../slices/users.slice";

let socket: Socket | null = null;

export const socketMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    const { dispatch } = store;

    // Обрабатываем socket actions
    switch (action.type) {
      case socketConnect.type: {
        if (socket?.connected) {
          socket.disconnect();
        }

        const { serverUrl, user, chatId } = action.payload;

        socket = io(serverUrl);

        // Настраиваем обработчики событий
        socket.on("connect", () => {
          console.log("Socket connected:", socket?.id);
          dispatch(socketConnected());
          dispatch(setConnectionStatus(true));
          dispatch(clearConnectionError());

          // Автоматически присоединяемся к чату
          dispatch(socketJoinChat({ chatId, user }));
        });

        socket.on("disconnect", (reason) => {
          console.log("Socket disconnected:", reason);
          dispatch(socketDisconnected(reason));
          dispatch(setConnectionStatus(false));
        });

        socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
          dispatch(socketError(error));
          dispatch(setConnectionError(error.message || "Connection failed"));
        });

        socket.on("new-message", (message) => {
          console.log("New message received:", message);
          dispatch(socketMessageReceived(message));
          dispatch(addMessage(message));
        });

        socket.on("edit-message", async (message) => {
          console.log("Edit message:", message);
          const oldMessages = await chatAPI.getMessages();
          dispatch(setMessages(oldMessages));
        });

        socket.on("pin-message", async (message) => {
          console.log("Message pinned:", message);
          const oldMessages = await chatAPI.getMessages();
          dispatch(setMessages(oldMessages));
        });

        socket.on("unpin-message", async (message) => {
          console.log("Message unpinned:", message);
          const oldMessages = await chatAPI.getMessages();
          dispatch(setMessages(oldMessages));
        });

        socket.on("delete-message", async (message) => {
          console.log("Message deleted:", message);
          const oldMessages = await chatAPI.getMessages();
          dispatch(setMessages(oldMessages));
        });
        socket.on("delete-all-messages", (data) => {
          console.log("All messages deleted:", data);
          dispatch(setMessages([])); // Очищаем сообщения на клиенте
        });

        socket.on("user-joined", (message) => {
          console.log("User joined:", message);
          dispatch(socketUserJoined(message));
          dispatch(addMessage(message));
        });

        socket.on("user-left", (message) => {
          console.log("User left:", message);
          dispatch(socketUserLeft(message));
          dispatch(addMessage(message));
        });

        socket.on("ban-user", (data) => {
          console.log("user banned:", data);
          dispatch(updUser(data));
        });

        socket.on("unban-user", (data) => {
          console.log("user unbanned:", data);
          dispatch(updUser(data));
        });

        socket.on("set-admin", (data) => {
          console.log("user banned:", data);
          dispatch(updUser(data));
        });

        socket.on("delete-admin", (data) => {
          console.log("user unbanned:", data);
          dispatch(updUser(data));
        });

        socket.on("error", (error) => {
          console.error("Socket error:", error);
          dispatch(socketError(error));
        });

        socket.on("pong", () => {
          console.log("Pong received");
          dispatch(socketPongReceived());
          dispatch(setPong(Date.now()));
        });

        break;
      }

      case socketDisconnect.type: {
        if (socket) {
          socket.disconnect();
          socket = null;
          dispatch(setConnectionStatus(false));
        }
        break;
      }

      case socketJoinChat.type: {
        if (socket?.connected) {
          const { chatId, user } = action.payload;
          socket.emit("join-chat", { chatId, user });
          console.log(`Joining chat: ${chatId} as ${user.first_name}`);
        }
        break;
      }

      case socketLeaveChat.type: {
        if (socket?.connected) {
          const { chatId, user } = action.payload;
          socket.emit("leave-chat", { chatId, user });
          console.log(`Leaving chat: ${chatId}`);
        }
        break;
      }

      case socketSendMessage.type: {
        if (socket?.connected) {
          const { chatId, message } = action.payload;
          socket.emit("send-message", { chatId, message });
          console.log("Sending message:", message.text);
        }
        break;
      }

      case socketEditMessage.type: {
        if (socket?.connected) {
          const { chatId, message } = action.payload;
          console.log("Aboba:", message);
          socket.emit("edit-message", { chatId, message });
          console.log("Editing message:", message.text);
        }
        break;
      }

      case socketPinMessage.type: {
        if (socket?.connected) {
          const { chatId, message } = action.payload;
          socket.emit("pin-message", { chatId, message });
          console.log("Pinned message:", message);
        }
        break;
      }

      case socketUnPinMessage.type: {
        if (socket?.connected) {
          const { chatId, message } = action.payload;
          socket.emit("unpin-message", { chatId, message });
          console.log("UnPinned message:", message);
        }
        break;
      }

      case socketDeleteMessage.type: {
        if (socket?.connected) {
          const { chatId, messageId } = action.payload;
          socket.emit("delete-message", { chatId, messageId });
          console.log("Delete message:", messageId);
        }
        break;
      }

      case socketDeleteAllMessages.type: {
        if (socket?.connected) {
          const chatId = action.payload;
          socket.emit("delete-all-messages", chatId);
          console.log("Delete all messages for chat:", chatId);
        }
        break;
      }

      case socketBanUser.type: {
        if (socket?.connected) {
          const { userId } = action.payload;
          socket.emit("ban-user", { userId });
          console.log("Banned user with id: ", userId);
        }
        break;
      }

      case socketUnbanUser.type: {
        if (socket?.connected) {
          const { userId } = action.payload;
          socket.emit("unban-user", { userId });
          console.log("Unbanned user with id:", userId);
        }
        break;
      }

      case socketSetAdmin.type: {
        if (socket?.connected) {
          const { userId } = action.payload;
          socket.emit("set-admin", { userId });
          console.log("Banned user with id: ", userId);
        }
        break;
      }

      case socketDeleteAdmin.type: {
        if (socket?.connected) {
          const { userId } = action.payload;
          socket.emit("delete-admin", { userId });
          console.log("Unbanned user with id:", userId);
        }
        break;
      }

      case socketPing.type: {
        if (socket?.connected) {
          socket.emit("ping");
          console.log("Ping sent");
        }
        break;
      }
    }

    return next(action);
  };

// Экспортируем функцию для получения socket (если нужно)
export const getSocket = () => socket;
