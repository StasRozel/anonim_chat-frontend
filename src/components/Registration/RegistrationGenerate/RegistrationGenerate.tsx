import React from "react";
import './../Registration.css';
import { generateRandomUser } from "../../../utils/generateRandomUser";
import { useAppDispatch } from "../../../hooks/useRedux";
import { setChatNickname } from "../../../store/slices/user.slice";
import { TelegramUser } from "../../../types/types";
import { ButtonRegistration } from "../ButtonRegistration";

export const RegistrationGenerate: React.FC<{user: TelegramUser}> = ({user}) => {
  const dispatch = useAppDispatch();

  const handleReload = () => {
    dispatch(setChatNickname(generateRandomUser()));
  };

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Введите имя"
          value={user?.chat_nickname || ''}
          onChange={(e) => {
            e.target.value;
          }}
          className="input-field"
        />
        <button className="reload" onClick={handleReload}>
          🔃
        </button>
      </div>
      <ButtonRegistration user={user}/>
    </div>
  );
};
