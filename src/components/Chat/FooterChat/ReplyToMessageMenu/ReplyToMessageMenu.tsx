import React from 'react';
import { Message } from "../../../../types/types";
import "./ReplyToMessageMenu.css";

interface ReplyToMessageMenuProps {
  message: Message;
  onClose?: () => void;
}

const ReplyToMessageMenu: React.FC<ReplyToMessageMenuProps> = ({ message, onClose }) => {
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className={`reply-to-message-menu ${!message ? 'loading' : ''}`}>
            <div>
                <p className="reply-to-message-menu-user">
                    Ответ на: {message ? message.user.chat_nickname == '' ?  message.user.first_name : message.user.chat_nickname : "Загрузка..."}
                </p>
                <p className="reply-to-message-menu-text">
                    {message ? message.text : "Загрузка..."}
                </p>
            </div>
            {onClose && (
                <button 
                    className="reply-to-message-menu-close"
                    onClick={handleClose}
                    aria-label="Закрыть ответ"
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default ReplyToMessageMenu;
