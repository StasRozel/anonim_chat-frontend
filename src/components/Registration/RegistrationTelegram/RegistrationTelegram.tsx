import React from 'react';
import './../Registration.css';
import { TelegramUser } from '../../../types/types';
import { ButtonRegistration } from '../ButtonRegistration';

export const RegistrationTelegram: React.FC<{user: TelegramUser}> = ({user}) => {
  return (
    <div className="container">
      <div className="input-container">
        <input type="text" placeholder="Введите имя" className="input-field" value={`${user?.first_name} ${user?.last_name}`}/>
      </div>
      <ButtonRegistration user={user}/>
    </div>
  );
};