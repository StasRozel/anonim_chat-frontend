import { useAppSelector } from "../../../hooks/useRedux";
import { setInputText } from "../../../store/slices/chat.slice";

interface InputTextProps {
  dispatch: any;
  handleSubmit: () => void;
}

const InputText: React.FC<InputTextProps> = ({
  dispatch,
  handleSubmit,
}) => {
  const { inputText } = useAppSelector((state) => state.chat);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
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
  );
};

export default InputText;
