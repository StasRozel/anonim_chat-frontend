import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { User } from "lucide-react";
import { getAvatarColor } from "../../../store/slices/avatar.slice";

const HeaderChat: React.FC<{ user: any; isConnected: boolean }> = ({
  user,
  isConnected,
}) => {
  const { color } = useAppSelector((state) => state.avatarColor);
  const dispatch = useAppDispatch();
  
  dispatch(getAvatarColor(user?.id));

  return (
    <header className="chat-header">
      <div
        className="chat-header-avatar"
        style={{
          backgroundColor: user ? color : "#3b82f6",
        }}
      >
        {user ? user.first_name[0] : <User size={20} />}
      </div>
      <div className="chat-header-info">
        <h1>Чат Center D17</h1>
        <p>
          {user
            ? `${user.first_name} ${isConnected ? "в сети" : "не подключен"}`
            : "Загрузка..."}
          {isConnected && (
            <span style={{ color: "#10b981", marginLeft: "8px" }}>●</span>
          )}
        </p>
      </div>
    </header>
  );
};

export default HeaderChat;
