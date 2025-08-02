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
} from "../actions/socket.actions";
import { setConnectionStatus, addMessage } from "../slices/chat.slice";
import {
  clearConnectionError,
  setConnectionError,
  setPong,
} from "../slices/socket.slice";

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
