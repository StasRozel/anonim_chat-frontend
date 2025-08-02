import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { useSocketRedux } from "../../hooks/useSocket";
import { Message, TelegramUser } from "../../types/types";
import "./ContextMenu.css";

interface ContextMenuProps {
  message: Message;
  user: TelegramUser | null;
  position: { x: number; y: number };
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ message, user, position, onClose }) => {
  const { currentChatId } = useAppSelector((state) => state.chat);
  const { pinMessage } = useSocketRedux();

  const handlePinMessage = () => {
    if (message.isPinned) {
    } else {
      pinMessage(currentChatId, message.id);
    }
    onClose();
  };

  const handleReply = () => {

  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.text);
    onClose();
  };

  return (
    <div 
      className="context-menu"
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
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
          <div className="context-menu-item context-menu-item-danger">
            🗑️ Удалить
          </div>
        </>
      )}
    </div>
  );
};

export default ContextMenu;