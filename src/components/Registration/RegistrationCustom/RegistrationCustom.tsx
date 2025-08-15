import React from 'react';
import './../Registration.css';

export const RegistrationCustom: React.FC = () => {
  return (
    <div className="container">
      <div className="input-container">
        <input type="text" placeholder="Введите имя" className="input-field" />
      </div>
      <div className="button-container">
         <button>Зарегистрироваться</button>
      </div>
    </div>
  );
};