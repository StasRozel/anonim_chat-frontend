import { useAppSelector } from "../../../hooks/useRedux";
import { setInputText } from "../../../store/slices/chat.slice";
import FilePicker from "../../FIleUpload/FilePicker";
import "./InputText.css";

interface InputTextProps {
  dispatch: any;
  handleSubmit: () => void;
  onFilesSelected?: (files: File[]) => void;
}

const InputText: React.FC<InputTextProps> = ({
  dispatch,
  handleSubmit,
  onFilesSelected,
}) => {
  const { inputText } = useAppSelector((state) => state.chat);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-with-file">
      <FilePicker onFilesSelected={onFilesSelected} />

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
    </div>
  );
};

export default InputText;
