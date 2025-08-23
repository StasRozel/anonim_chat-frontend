import { useAppDispatch } from "../../hooks/useRedux";
import { authAPI } from "../../services/auth.api";
import { closeRegistrationModal } from "../../store/slices/modal.slice";
import { authenticatedUser } from "../../store/slices/user.slice";
import { TelegramUser } from "../../types/types";

export const ButtonRegistration: React.FC<{ user: TelegramUser }> = ({ user }) => {
  const dispatch = useAppDispatch();

  const handleRegister = async () => {
    authAPI.register(user as TelegramUser);
    console.log("User registered:", user);
    dispatch(closeRegistrationModal());
    dispatch(authenticatedUser(true));
  };

  return (
    <div className="button-container">
      <button onClick={handleRegister}>Зарегистрироваться</button>
    </div>
  );
};
