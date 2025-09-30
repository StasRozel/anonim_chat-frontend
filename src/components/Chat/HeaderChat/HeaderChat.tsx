import { User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { useNavigate } from "react-router-dom";
import "./HeaderChat.css";
import { getAvatarColor } from "../../../store/slices/avatar.slice";
import { useEffect } from "react";

const HeaderChat: React.FC<{ user: any; isConnected: boolean }> = ({
  user,
  isConnected,
}) => {
  const { color } = useAppSelector((state) => state.avatarColor);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      dispatch(getAvatarColor(user.id));
    }
  }, [user?.id]);

  const handleAdminClick = () => {
    if (
      user?.is_admin ||
      user?.id === Number(process.env.REACT_APP_SUPER_ADMIN_ID)
    ) {
      navigate("/admin");
    }
  };

  const isAdmin =
    user?.is_admin || user?.id === Number(process.env.REACT_APP_SUPER_ADMIN_ID);

  return (
    <header className="chat-header">
      {user.is_admin && (
        <div
          className={` chat-header-title ${
            isAdmin ? "chat-header-title--clickable" : ""
          }`}
          onClick={handleAdminClick}
        >
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      )}
      <div
        className="chat-header-avatar"
        style={{
          backgroundColor: user ? color : "#3b82f6",
        }}
      >
        {user && user.first_name ? user.first_name[0] : <User size={20} />}
      </div>
      <div className="chat-header-info">
        <h1 className="chat-header-title">Чат Center D17</h1>
        <p className="chat-header-status">
          {user && user.first_name
            ? `${user.first_name} ${
                user.chat_nickname ? `(${user.chat_nickname})` : ""
              } ${isConnected ? "в сети" : "не подключен"}`
            : "Загрузка..."}
          {isConnected && <span className="chat-header-online">●</span>}
        </p>
      </div>
    </header>
  );
};

export default HeaderChat;
