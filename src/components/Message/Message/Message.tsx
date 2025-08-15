import { useEffect, useRef, useState } from "react";
import { Message, TelegramUser } from "../../../types/types";
import { formatTime } from "../../../utils/formatTime";
import ContextMenu from "../../ContextMenu/ContextMenu";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { hideContextMenu, showContextMenu } from "../../../store/slices/contextMenu.slice";
import "./Message.css";
import { chatAPI } from "../../../services/api";
import ReplyToMessage from "../ReplyToMessage/ReplyToMessage";

// Компонент отдельного сообщения
const MessageComponent: React.FC<{
  message: Message;
  currentUser: TelegramUser | null;
  messageRef?: React.RefObject<HTMLDivElement>;
}> = ({ message, currentUser, messageRef }) => {
  // Определяем системное сообщение
  const isSystem = message.type === "system";
  // Только для не-системных сообщений сравниваем user.id
  const isOwnMessage = !isSystem && currentUser && message.user?.id === currentUser.id;

  const internalRef = useRef<HTMLDivElement>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const { isOpen, position } = useAppSelector((state) => state.contextMenu);
  const dispatch = useAppDispatch();

  // Выбираем корректный ref
  const elementRef = messageRef || internalRef;

  // Функция для цвета аватара
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
    e.preventDefault();
    dispatch(showContextMenu({
      position: { x: e.clientX, y: e.clientY },
      message,
    }));
  };

  const handleClickOutside = () => {
    dispatch(hideContextMenu());
  };

  // Загрузка сообщения, на которое отвечаем
  useEffect(() => {
    const loadReply = async () => {
      if (message.replyTo) {
        try {
          const reply = await chatAPI.getMessageById(message.replyTo);
          setReplyToMessage(reply);
        } catch {
          /* можно логировать через logger */
        }
      }
    };
    loadReply();
  }, [message.replyTo]);

  // Обработчик кликов вне контекст-меню
  useEffect(() => {
    if (isOpen) {

      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen]);

  

  // Рендерим системное сообщение без обращения к message.user
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
        onContextMenu={handleContextMenu}
        data-message-id={message.id}
      >
        <div className="message-content">
          {/* Аватар только для не-системных сообщений с валидным user */}
          {message.user && (
            <div
              className="message-avatar"
              style={{ backgroundColor: getAvatarColor(message.user.id) }}
            >
              {message.user.first_name[0]}
            </div>
          )}
          <div className="message-bubble">
            <ReplyToMessage message={message} replyToMessage={replyToMessage}/>
            {/* Автор показывается только если не собственное сообщение */}
            {!isOwnMessage && message.user && (
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