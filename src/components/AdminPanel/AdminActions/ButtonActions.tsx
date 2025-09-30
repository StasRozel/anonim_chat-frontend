import { useAppSelector } from "../../../hooks/useRedux";
import { TelegramUser } from "../../../types/types";

type UserBooleanFields = "is_admin" | "is_banned";
type ActionNames = Record<UserBooleanFields, [string, string]>;

export const ButtonActions: React.FC<{user: TelegramUser, handler: (user: TelegramUser) => void, action_name: UserBooleanFields}> = ({user, handler, action_name}) => {
  const { user: yourInfo } = useAppSelector((state => state.user))
  const action_names: ActionNames = {
    "is_admin": ["Снять с админов", "Назначить админом"],
    "is_banned": ["Разблокировать", "Заблокировать"]
  }

  return (
    <div className="user-card__actions">
      <button
        className={`btn ${user[action_name] ? "btn--positive" : "btn--negative"} ${user.id === yourInfo?.id ? "btn--disabled" : ""}`}
        onClick={() => handler(user)}
        disabled={user.id === yourInfo?.id && Number(process.env.SUPER_ADMIN_ID) === user.id}
      >
        {user[action_name] ? action_names[action_name][0] : action_names[action_name][1]}
      </button>
    </div>
  );
};

