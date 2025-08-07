import React from "react";
import { useAppSelector } from "../../hooks/useRedux";
import { useSocketRedux } from "../../hooks/useSocket";
import { TelegramUser } from "../../types/types";
import "./ContextMenu.css";

interface ContextMenuProps {
  user: TelegramUser | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ user, position, onClose }) => {
  const { currentChatId } = useAppSelector((state) => state.chat);
  const { message } = useAppSelector((state) => state.contextMenu);
  const { pinMessage, unPinMessage, deleteMessage } = useSocketRedux();

  if (!message) return null;

  const handlePinMessage = () => {
    if (message.isPinned) {
      unPinMessage(currentChatId, message.id);
    } else {
      pinMessage(currentChatId, message.id);
    }
    onClose();
  };

  const handleReply = () => {
  };

  const handleDeleteMessage = () => {
    deleteMessage(currentChatId, message.id);
  }

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.text);
    onClose();
  };

  return (
    <div 
      className="context-menu"
      style={{
        position: 'fixed',
        top: position?.y,
        left: position?.x,
        zIndex: 1000,
      }}
      onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике на меню
    >
      <div className="context-menu-item" onClick={handleReply}>
        📩 Ответить
      </div>
      
      <div className="context-menu-item" onClick={handlePinMessage}>
        {message.isPinned ? "📌 Открепить" : "📌 Закрепить"}
      </div>
      
      <div className="context-menu-item" onClick={handleCopyMessage}>
        📋 Копировать текст
      </div>
      
      {user && message.user.id === user.id && (
        <>
          <div className="context-menu-separator"></div>
          <div className="context-menu-item context-menu-item-danger" onClick={handleDeleteMessage}>
            🗑️ Удалить
          </div>

          <div className="context-menu-item context-menu-item-danger">
            🗑️ Очистить историю чата
          </div>
        </>
      )}
    </div>
  );
};

export default ContextMenu;