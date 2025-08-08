import { Message } from "../../../types/types";
import "./ReplyToMessage.css";

const ReplyToMessage: React.FC<{ message: Message, replyToMessage: Message | null}> = ({ message, replyToMessage }) => {
  return (
    <div className="message-reply-to">
      {message.replyTo != null && replyToMessage && (
        <div className="message-reply-to-content">
          <div className="reply-to-user-name">{replyToMessage.user.first_name}</div>
          <div className="reply-to-text">{replyToMessage.text}</div>
        </div>
      )}
    </div>
  );
};

export default ReplyToMessage;