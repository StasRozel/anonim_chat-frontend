import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { Send } from "lucide-react";
import { clearInputText } from "../../../store/slices/chat.slice";
import { useSocketRedux } from "../../../hooks/useSocket";
import { Message } from "../../../types/types";
import ReplyToMessageMenu from "./ReplyToMessageMenu/ReplyToMessageMenu";
import { clearReplyToMessage } from "../../../store/slices/replyTo.slice";
import InputText from "./InputText";
import { setEditMessage } from "../../../store/slices/message.slice";

const FooterChat: React.FC<{ user: any; isConnected: boolean }> = ({
  user,
  isConnected,
}) => {
  const { inputText, currentChatId } = useAppSelector((state) => state.chat);
  const { isEditMessage } = useAppSelector((state) => state.editMessage);
  const { replyToMessageId, message: replyToMessage } = useAppSelector(
    (state) => state.replyTo
  );
  const { message } = useAppSelector((state) => state.contextMenu); 
  const { sendMessage: sendSocketMessage, editMessage: editSocketMessage } =
    useSocketRedux();
  const dispatch = useAppDispatch();

  const sendMessage = () => {
    if (!inputText.trim() || !isConnected || !user) return;

    sendSocketMessage(currentChatId, replyToMessageId, inputText, user);
    dispatch(clearInputText());
    dispatch(clearReplyToMessage());
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
      <div className="chat-input-wrapper">
        <InputText dispatch={dispatch} handleSubmit={handleSubmit} />
        <button
          onClick={handleSubmit}
          disabled={!inputText.trim() || !isConnected}
          className="chat-send-button"
          title={
            !isConnected ? "Нет подключения к серверу" : "Отправить сообщение"
          }
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default FooterChat;
