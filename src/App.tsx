import "./App.css";
import TelegramChatApp from "./components/Layout/TelegramChatApp";
import { RegistrationSwitcher } from "./components/Registration/RegistrationSwitcher/RegistrationSwitcher";
import { useTelegram } from "./hooks/useTelegram";
import { useAppDispatch } from "./hooks/useRedux";
import { closeRegistrationModal } from "./store/slices/modal.slice";


function App() {
  const { isAuthenticated } = useTelegram();
  const dispatch = useAppDispatch();

  const handleRegistrationClose = () => {
    dispatch(closeRegistrationModal());
  };


  return (
    <div className="App">
      {isAuthenticated ? (
        <TelegramChatApp />
      ) : (
        <RegistrationSwitcher
          onClose={handleRegistrationClose}
        />
      )}
    </div>
  );
}

export default App;
