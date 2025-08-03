import { useEffect, useRef, useState } from "react";
import { Message, TelegramUser } from "../../types/types";
import { formatTime } from "../../utils/formatTime";
import ContextMenu from "../ContextMenu/ContextMenu";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { hideContextMenu, showContextMenu } from "../../store/slices/contextMenu.slice";
import "./Message.css";

// Компонент отдельного сообщения
const MessageComponent: React.FC<{
  message: Message;
  currentUser: TelegramUser | null;
  messageRef?: React.RefObject<HTMLDivElement>; // Добавляем проп для ref
}> = ({ message, currentUser, messageRef }) => {
  const isOwnMessage = currentUser && message.user.id === currentUser.id;
  const isSystem = message.type === "system";
  const internalRef = useRef<HTMLDivElement>(null);
  const { isOpen, position, message: contextMessage } = useAppSelector((state) => state.contextMenu);
  const dispatch = useAppDispatch();

  // Используем переданный ref или внутренний
  const elementRef = messageRef || internalRef;

  // Функция для генерации цвета аватара на основе ID пользователя
  const getAvatarColor = (userId: number) => {
    const colors = [
      "#3b82f6", // blue
      "#ef4444", // red
      "#10b981", // green
      "#f59e0b", // amber
      "#8b5cf6", // purple
      "#ec4899", // pink
      "#06b6d4", // cyan
      "#84cc16", // lime
      "#f97316", // orange
      "#6366f1", // indigo
    ];
    return colors[userId % colors.length];
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Отменяем стандартное контекстное меню браузера

    dispatch(showContextMenu({
      position: { x: e.clientX, y: e.clientY },
      message: message
    }));
  };

  const handleClickOutside = () => {
    dispatch(hideContextMenu())
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isOpen]);

  if (isSystem) {
    return (
      <div 
        ref={elementRef}
        className="system-message"
        data-message-id={message.id}
      >
        <div className="system-message-content">{message.text}</div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={elementRef}
        className={`message ${isOwnMessage ? "own" : "other"} ${message.isPinned ? "message-pinned" : ""}`}
        onContextMenu={handleContextMenu} // Добавляем обработчик ПКМ
        data-message-id={message.id} // Добавляем data-атрибут для поиска
      >
        <div className="message-content">
          <div
            className="message-avatar"
            style={{ backgroundColor: getAvatarColor(message.user.id) }}
          >
            {message.user.first_name[0]}
          </div>
          <div className="message-bubble">
            {!isOwnMessage && (
              <div className="message-author">{message.user.first_name}</div>
            )}
            <div className="message-text">{message.text}</div>
            <div className="message-time">{formatTime(message.timestamp)}</div>
          </div>
        </div>
      </div>
      {isOpen && (
        <ContextMenu
          user={currentUser}
          position={position}
          onClose={() => dispatch(hideContextMenu())}
        />
      )}
    </>
  );
};

export default MessageComponent;
