import React from "react";
import './../Registration.css';
import { generateRandomUser } from "../../../utils/generateRandomUser";
import { useTelegram } from "../../../hooks/useTelegram";
import { useAppDispatch } from "../../../hooks/useRedux";
import { setUser } from "../../../store/slices/user.slice";

export const RegistrationGenerate: React.FC = () => {
  const { user } = useTelegram();
  const dispatch = useAppDispatch();

  const handleReload = () => {
    dispatch(setUser(generateRandomUser()));
  };

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Введите имя"
          value={user?.first_name}
          onChange={(e) => {
            e.target.value;
          }}
          className="input-field"
        />
        <button className="reload" onClick={handleReload}>
          🔃
        </button>
      </div>
      <div className="button-container">
        <button>Зарегистрироваться</button>
      </div>
    </div>
  );
};
