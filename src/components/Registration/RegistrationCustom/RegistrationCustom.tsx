import React from "react";
import "./../Registration.css";
import { TelegramUser } from "../../../types/types";
import { setChatNickname } from "../../../store/slices/user.slice";
import { ButtonRegistration } from "../ButtonRegistration";
import { useAppDispatch } from "../../../hooks/useRedux";

export const RegistrationCustom: React.FC<{ user: TelegramUser }> = ({
  user,
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Введите имя"
          className="input-field"
          value={user.chat_nickname || ""}
          onChange={(e) => {
            dispatch(setChatNickname(e.target.value));
          }}
        />
      </div>
      <ButtonRegistration user={user} />
    </div>
  );
};
