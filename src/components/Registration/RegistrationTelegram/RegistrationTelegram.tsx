import React from 'react';
import './../Registration.css';
import { useAppSelector } from '../../../hooks/useRedux';

export const RegistrationTelegram: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);

  return (
    <div className="container">
      <div className="input-container">
        <input type="text" placeholder="Введите имя" className="input-field" value={user?.first_name}/>
      </div>
      <div className="button-container">
         <button>Зарегистрироваться</button>
      </div>
    </div>
  );
};