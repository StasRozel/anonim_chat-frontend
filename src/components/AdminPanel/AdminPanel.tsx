import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { getAvatarColor } from "../../store/slices/avatar.slice";
import "./AdminPanel.css";
import { TelegramUser } from "../../types/types";
import { userAPI } from "../../services/user.api";
import { useSocketRedux } from "../../hooks/useSocket";
import { setUsers } from "../../store/slices/users.slice";
import { ButtonActions } from "./AdminActions/ButtonActions";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const AdminPanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { users } = useAppSelector((state) => state.users);
  const { color } = useAppSelector((state) => state.avatarColor);
  const { banUser, unbanUser, setAdmin, deleteAdmin } = useSocketRedux();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userAPI.getUsers();
      dispatch(setUsers(Object.values(data)));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleAvatarColor = (userId: number) => {
    dispatch(getAvatarColor(userId));
  };

  const handleBanUnban = (user: TelegramUser) => {
    if (user.is_banned) {
      unbanUser(user);
    } else {
      banUser(user);
    }
  };

  const handleSetRemoveAdmin = (user: TelegramUser) => {
    if (user.is_admin) {
      deleteAdmin(user);
    } else {
      setAdmin(user);
    }
  };

  const handleBackToChat = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="admin-panel__loading">Загрузка...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <button 
          onClick={handleBackToChat}
          className="admin-panel__back-button"
        >
          <ArrowLeft size={20} />
          <span>Назад к чату</span>
        </button>
        <h1 className="admin-panel__title">Панель администратора</h1>
      </div>

      <div className="admin-panel__stats">
        <div className="admin-panel__stat">
          <span>Всего пользователей: {users.length}</span>
        </div>
        <div className="admin-panel__stat">
          <span>
            Заблокированных: {users.filter((u) => u.is_banned).length}
          </span>
        </div>
      </div>

      <div className="admin-panel__users">
        {users.map((user) => (
          <div
            key={user.id}
            className={`user-card ${user.is_banned ? "user-card--banned" : ""}`}
          >
            <div className="user-card__avatar">
              {user.photo_url ? (
                <img
                  src={user.photo_url}
                  alt={`${user.first_name || ''} ${user.last_name || ''}`}
                  className="user-card__avatar-img"
                />
              ) : (
                <div
                  className="user-card__avatar-placeholder"
                  style={{ backgroundColor: color }}
                  onMouseEnter={() => handleAvatarColor(user.id)}
                >
                  {getInitials(user.first_name || '', user.last_name || '')}
                </div>
              )}
            </div>

            <div className="user-card__info">
              <div className="user-card__name">
                {user.first_name || 'Безымянный'} {user.last_name || ''}
              </div>
              {user.username && (
                <div className="user-card__username">@{user.username}</div>
              )}
              {user.chat_nickname && (
                <div className="user-card__nickname">
                  Ник: {user.chat_nickname}
                </div>
              )}
              <div className="user-card__status">
                {user.is_banned ? (
                  <span className="status status--banned">Заблокирован</span>
                ) : (
                  <span className="status status--active">Активен</span>
                )}
              </div>
              <div className="user-card__role">
                {user.is_admin ? (
                  <span className="role role--admin">Админ</span>
                ) : (
                  <span className="role role--user">Пользователь</span>
                )}
              </div>
            </div>

            <ButtonActions user={user} handler={handleSetRemoveAdmin} action_name="is_admin"/>
            <ButtonActions user={user} handler={handleBanUnban} action_name="is_banned"/>
          </div>
        ))}
      </div>
    </div>
  );
};