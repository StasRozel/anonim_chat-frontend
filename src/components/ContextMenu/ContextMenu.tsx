import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { useSocketRedux } from "../../hooks/useSocket";
import { TelegramUser } from "../../types/types";
import "./ContextMenu.css";
import {
  setMessage,
  setReplyToMessage,
} from "../../store/slices/replyTo.slice";
import { setInputText } from "../../store/slices/chat.slice";
import { setEditMessage } from "../../store/slices/message.slice";

interface ContextMenuProps {
  user: TelegramUser | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  user,
  position,
  onClose,
}) => {
  const { currentChatId } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const { message } = useAppSelector((state) => state.contextMenu);
  const { pinMessage, unPinMessage, deleteMessage, deleteAllMessages } =
    useSocketRedux();

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
    dispatch(setReplyToMessage(message.id));
    dispatch(setMessage(message));
    onClose();
  };

  const handleDeleteMessage = () => {
    deleteMessage(currentChatId, message.id);
    onClose();
  };

  const handleDeleteAllMessages = () => {
    deleteAllMessages(currentChatId);
    onClose();
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.text);
    onClose();
  };

  const hanndleEditMessage = () => {
    dispatch(setMessage(message));
    dispatch(setInputText(message.text));
    dispatch(setEditMessage(true));
    console.log("message: ", message);
    onClose();
  };

  return (
    <div
      className="context-menu"
      style={{
        position: "fixed",
        top: position?.y,
        left: position?.x,
        zIndex: 1000,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu-item" onClick={handleReply}>
        📩 Ответить
      </div>

      {user?.is_admin && (
        <div className="context-menu-item" onClick={handlePinMessage}>
        {message.isPinned ? "📌 Открепить" : "📌 Закрепить"}
      </div>
      )}

      <div className="context-menu-item" onClick={handleCopyMessage}>
        📋 Копировать текст
      </div>

      {user?.is_admin && (
        <div
        className="context-menu-item context-menu-item-danger"
        onClick={handleDeleteAllMessages}
      >
        🗑️ Очистить историю чата
      </div>
      )}

      {user && message.user.id === user.id && (
        <>
          <div className="context-menu-separator"></div>
          <div className="context-menu-item" onClick={hanndleEditMessage}>
            ✏️Редактировать
          </div>

          <div
            className="context-menu-item context-menu-item-danger"
            onClick={handleDeleteMessage}
          >
            🗑️ Удалить
          </div>
        </>
      )}
    </div>
  );
};

export default ContextMenu;
