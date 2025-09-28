import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { Send } from "lucide-react";
import { clearInputText } from "../../../store/slices/chat.slice";
import { useSocketRedux } from "../../../hooks/useSocket";
import { Message } from "../../../types/types";
import ReplyToMessageMenu from "./ReplyToMessageMenu/ReplyToMessageMenu";
import { clearReplyToMessage } from "../../../store/slices/replyTo.slice";
import InputText from "./InputText";
import { setEditMessage } from "../../../store/slices/message.slice";
import { useState } from "react";
import "./FooterChat.css";

const FooterChat: React.FC<{ user: any; isConnected: boolean }> = ({
  user,
  isConnected,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [index: number]: number }>({});
  const { inputText, currentChatId } = useAppSelector((state) => state.chat);
  const { isEditMessage } = useAppSelector((state) => state.editMessage);
  const { replyToMessageId, message: replyToMessage } = useAppSelector(
    (state) => state.replyTo
  );
  const { message } = useAppSelector((state) => state.contextMenu);
  const {
    sendMessage: sendSocketMessage,
    editMessage: editSocketMessage,
    sendMessageWithFiles,
  } = useSocketRedux();
  const dispatch = useAppDispatch();

  const sendMessage = () => {
    if (
      (!inputText.trim() && selectedFiles.length === 0) ||
      !isConnected ||
      !user
    )
      return;

    // Используем новый метод если есть файлы
    if (selectedFiles.length > 0) {
      sendMessageWithFiles(
        currentChatId,
        replyToMessageId,
        inputText, // Allow empty text when files are present
        user,
        selectedFiles,
        handleProgress
      );
    } else {
      // Only send text message if there's actual text content
      if (!inputText.trim()) return;
      sendSocketMessage(currentChatId, replyToMessageId, inputText, user);
    }

    dispatch(clearInputText());
    dispatch(clearReplyToMessage());
    setSelectedFiles([]); // очищаем файлы
    setUploadProgress({}); // очищаем прогресс
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleProgress = (fileIndex: number, percent: number) => {
    setUploadProgress(prev => ({ ...prev, [fileIndex]: percent }));
  };

  const handleFileRemove = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadProgress(prev => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  const editMessage = () => {
    if (!inputText.trim() || !isConnected || !user) return;

    const messageToEdit = message || replyToMessage;
    if (!messageToEdit?.id) {
      console.error("No message to edit");
      return;
    }

    console.log("Editing message: ", messageToEdit);
    editSocketMessage(currentChatId, messageToEdit.id, inputText);
    dispatch(setEditMessage(false));
    dispatch(clearInputText());
    dispatch(clearReplyToMessage());
  };

  const handleSubmit = () => {
    console.log("handleSubmit called, isEditMessage:", isEditMessage);
    if (isEditMessage) {
      editMessage();
    } else {
      sendMessage();
    }
  };

  const handleCloseReply = () => {
    dispatch(clearReplyToMessage());
  };

  return (
    <div className="chat-input-container">
      {replyToMessageId && (
        <div className="reply-to-message">
          <ReplyToMessageMenu
            message={replyToMessage as Message}
            onClose={handleCloseReply}
          />
        </div>
      )}

     
      {selectedFiles.length > 0 && (
        <div className="selected-files-list">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="selected-file-item">
              <span className="selected-file-name">{file.name}</span>
              <button className="selected-file-remove" onClick={() => handleFileRemove(idx)} type="button">Remove</button>
            </div>
          ))}
        </div>
      )}

      <div className="chat-input-wrapper">
        <InputText dispatch={dispatch} handleSubmit={handleSubmit} onFilesSelected={handleFileSelect} />
        <button
          onClick={handleSubmit}
          disabled={
            (!inputText.trim() && selectedFiles.length === 0) || !isConnected
          }
          className="chat-send-button"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default FooterChat;
