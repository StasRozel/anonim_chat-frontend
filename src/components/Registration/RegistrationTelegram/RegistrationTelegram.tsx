import React from 'react';
import './../Registration.css';
import { useTelegram } from '../../../hooks/useTelegram';

export const RegistrationTelegram: React.FC = () => {
  const { user } = useTelegram();

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