import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { Send } from "lucide-react";
import { clearInputText, setInputText } from "../../../store/slices/chat.slice";
import { useSocketRedux } from "../../../hooks/useSocket";

const FooterChat: React.FC<{ user: any; isConnected: boolean }> = ({
  user,
  isConnected,
}) => {
  const { inputText, currentChatId } = useAppSelector((state) => state.chat);
  const { sendMessage: sendSocketMessage } = useSocketRedux();
  const dispatch = useAppDispatch();

  const sendMessage = () => {
    if (!inputText.trim() || !isConnected || !user) return;

    sendSocketMessage(currentChatId, inputText, user);
    dispatch(clearInputText());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <input
          type="text"
          value={inputText}
          onChange={(e) => {
            dispatch(setInputText(e.target.value));
          }}
          onKeyPress={handleKeyPress}
          placeholder="Напишите сообщение..."
          className="chat-input"
        />
        <button
          onClick={sendMessage}
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
