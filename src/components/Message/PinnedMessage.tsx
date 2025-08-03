import { Pin, X } from "lucide-react";
import { Message } from "../../types/types";
import "./PinnedMessage.css";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  hideContextMenu,
  showContextMenu,
} from "../../store/slices/contextMenu.slice";
import { useSocketRedux } from "../../hooks/useSocket";

interface PinnedMessageProps {
  message: Message;
  onUnpin?: () => void;
  onClose?: () => void;
  onClick?: () => void;
}

const PinnedMessage: React.FC<PinnedMessageProps> = ({
  message,
  onUnpin,
  onClose,
  onClick,
}) => {
  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    onClose?.();
  };

  const handleContainerClick = () => {
    onClick?.();
  };

  return (
    <div className="pinned-message-content" onClick={handleContainerClick}>
      <div className="pinned-message-info">
        <div className="pinned-message-details">
          <div className="pinned-message-label">Закрепленное сообщение</div>
          <div className="pinned-message-text">
            <span className="pinned-message-author">
              {message.user.first_name}:
            </span>
            {truncateText(message.text, 60)}
          </div>
        </div>
      </div>

      <div className="pinned-message-actions">
        <div className="pinned-message-pin-icon">
          <Pin size={14} />
        </div>
        {onClose && (
          <button
            className="pinned-message-action-btn"
            onClick={handleClose}
            title="Скрыть закрепленное сообщение"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PinnedMessage;
