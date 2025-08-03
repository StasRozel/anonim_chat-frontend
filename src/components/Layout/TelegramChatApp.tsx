import React, { useEffect, useRef, useState, useMemo } from "react";
import "./TelegramChatApp.css";
import { chatAPI } from "../../services/api";
import MessageComponent from "../Message/Message";
import { Message } from "../../types/types";
import { useTelegram } from "../../hooks/useTelegram";
import {
  setMessages,
} from "../../store/slices/chat.slice";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { useSocketRedux } from "../../hooks/useSocket";
import HeaderChat from "../Chat/HeaderChat/HeaderChat";
import FooterChat from "../Chat/FooterChat/FooterChat";
import PinnedMessage from "../Message/PinnedMessage";

const TelegramChatApp: React.FC = () => {
  const { user } = useTelegram();
  const {
    connect,
    disconnect,
  } = useSocketRedux();

  const dispatch = useAppDispatch();

  const { messages, isConnected, currentChatId } = useAppSelector(
    (state) => state.chat
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);
  
  // Создаем refs для каждого сообщения
  const messageRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});

  // Мемоизируем закрепленные сообщения
  const pinnedMessages = useMemo(() => 
    messages.filter((msg) => msg.isPinned),
    [messages]
  );

  useEffect(() => {
    if (user) {
      const serverUrl =
        process.env.REACT_APP_API_URL || "http://localhost:3001/";
      connect(serverUrl, user, currentChatId);
    }

    return () => {
      disconnect();
    };
  }, [user, currentChatId, connect, disconnect]);

  useEffect(() => {
    const fetchMessages = async () => {
      const oldMessages = await chatAPI.getMessages();
      dispatch(setMessages(oldMessages));
    };
    fetchMessages();
  }, [dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Создаем refs для новых сообщений
  useEffect(() => {
    messages.forEach(message => {
      if (!messageRefs.current[message.id]) {
        messageRefs.current[message.id] = React.createRef<HTMLDivElement>();
      }
    });
  }, [messages]);

  // Функция для скролла к конкретному сообщению
  const scrollToMessage = (messageId: string) => {
    const messageRef = messageRefs.current[messageId];
    if (messageRef?.current) {
      messageRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" // Центрируем сообщение на экране
      });
      
      // Добавляем визуальный эффект выделения
      messageRef.current.classList.add('message-highlighted');
      setTimeout(() => {
        messageRef.current?.classList.remove('message-highlighted');
      }, 2000);
    } else {
      // Если ref не найден, используем data-атрибут
      const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
      if (messageElement) {
        messageElement.scrollIntoView({ 
          behavior: "smooth", 
          block: "center" 
        });
        
        messageElement.classList.add('message-highlighted');
        setTimeout(() => {
          messageElement.classList.remove('message-highlighted');
        }, 2000);
      }
    }
  };

  const handlePinnedMessageClick = () => {
    if (pinnedMessages.length > 0) {
      const currentMessage = pinnedMessages[currentPinnedIndex];
      scrollToMessage(currentMessage.id);
      
      // Переходим к следующему закрепленному сообщению для следующего клика
      setCurrentPinnedIndex((prevIndex) => (prevIndex + 1) % pinnedMessages.length);
    }
  };

  const currentPinnedMessage = pinnedMessages[currentPinnedIndex];

  return (
    <div className="chat-container">
      <HeaderChat user={user} isConnected={isConnected} />
      
      {/* Показываем закрепленное сообщение */}
      {pinnedMessages.length > 0 && currentPinnedMessage && (
        <div className="pinned-message-container">
          <PinnedMessage 
            message={currentPinnedMessage} 
            onClick={handlePinnedMessageClick}
          />
        </div>
      )}
      
      <div className="chat-messages">
        {messages.map((message: Message) => (
          <MessageComponent
            key={message.id}
            message={message}
            currentUser={user}
            messageRef={messageRefs.current[message.id]}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <FooterChat user={user} isConnected={isConnected} />
    </div>
  );
};

export default TelegramChatApp;