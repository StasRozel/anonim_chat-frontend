import { Message } from "../../../types/types";
import "./ReplyToMessage.css";

const ReplyToMessage: React.FC<{ message: Message, replyToMessage: Message | null}> = ({ message, replyToMessage }) => {
  return (
    <>
    {message.replyTo != null && replyToMessage && (
    <div className="message-reply-to">
      
        <div className="message-reply-to-content">
          <div className="reply-to-user-name">{replyToMessage.user.chat_nickname == '' ? replyToMessage.user.first_name : replyToMessage.user.chat_nickname}</div>
          <div className="reply-to-text">{replyToMessage.text}</div>
        </div>
      
    </div>
    )}</>
  );
};

export default ReplyToMessage;