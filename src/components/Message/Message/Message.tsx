import { useEffect, useRef, useState } from "react";
import { Message, TelegramUser } from "../../../types/types";
import { formatTime } from "../../../utils/formatTime";
import ContextMenu from "../../ContextMenu/ContextMenu";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { hideContextMenu, showContextMenu } from "../../../store/slices/contextMenu.slice";
import "./Message.css";
import { chatAPI } from "../../../services/api";
import ReplyToMessage from "../ReplyToMessage/ReplyToMessage";
import { getAvatarColor } from "../../../store/slices/avatar.slice";

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
  const { color } = useAppSelector((state) => state.avatarColor);
  const dispatch = useAppDispatch();

  // Выбираем корректный ref
  const elementRef = messageRef || internalRef;

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
getAvatarColor(message.user.id)
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
              style={{ backgroundColor:  color}}
            >
              {message.user.chat_nickname?.charAt(0).toUpperCase() || message.user.first_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="message-bubble">
            <ReplyToMessage message={message} replyToMessage={replyToMessage}/>
            {!isOwnMessage && message.user && (
              <div className="message-author">{message.user.chat_nickname || message.user.first_name}</div>
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