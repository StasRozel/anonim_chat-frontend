import { Pin, X } from "lucide-react";
import { Message } from "../../types/types"
import "./PinnedMessage.css";

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
  onClick 
}) => {
 const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

    return (
      <div className="chat-pinned-message" onClick={onClick}>
        <div className="chat-pinned-content">
          <div className="chat-pinned-info">
            <div className="chat-pinned-icon">
              <Pin size={14} />
            </div>
            <div className="chat-pinned-details">
              <div className="chat-pinned-label">Закрепленное сообщение</div>
              <div className="chat-pinned-text">
                <span className="chat-pinned-author">{message.user.first_name}:</span>
                {truncateText(message.text, 60)}
              </div>
            </div>
          </div>
          
          <div className="chat-pinned-actions">
            {onClose && (
              <button 
                className="chat-pinned-action-btn"
                // onClick={handleClose}
                title="Скрыть закрепленное сообщение"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
}

export default PinnedMessage;