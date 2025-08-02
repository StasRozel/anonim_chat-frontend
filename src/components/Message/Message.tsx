import { Message, TelegramUser } from "../../types/types";
import { formatTime } from "../../utils/formatTime";

// Компонент отдельного сообщения
const MessageComponent: React.FC<{
  message: Message;
  currentUser: TelegramUser | null;
}> = ({ message, currentUser }) => {
  const isOwn = currentUser && message.user.id === currentUser.id;
  const isSystem = message.type === "system";

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

  if (isSystem) {
    return (
      <div className="system-message">
        <div className="system-message-content">{message.text}</div>
      </div>
    );
  }

  return (
    <div className={`message ${isOwn ? "own" : "other"}`}>
      <div className="message-content">
        <div
          className="message-avatar"
          style={{ backgroundColor: getAvatarColor(message.user.id) }}
        >
          {message.user.first_name[0]}
        </div>
        <div className="message-bubble">
          {!isOwn && (
            <div className="message-author">{message.user.first_name}</div>
          )}
          <div className="message-text">{message.text}</div>
          <div className="message-time">{formatTime(message.timestamp)}</div>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
