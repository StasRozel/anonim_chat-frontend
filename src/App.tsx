import React, { useState } from 'react';
import './App.css';
import TelegramChatApp from './components/Layout/TelegramChatApp';
import { RegistrationSwitcher } from './components/Registration/RegistrationSwitcher/RegistrationSwitcher';

function App() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleRegistrationClose = () => {
    setIsRegistrationOpen(false);
    setIsAuthenticated(true);
  };

  const handleOpenRegistration = () => {
    setIsRegistrationOpen(true);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        // Обычный чат во весь экран после авторизации
        <TelegramChatApp />
      ) : (
        // Welcome screen только если пользователь не авторизован
        <div className="welcome-screen">
          <h1>Добро пожаловать в анонимный чат!</h1>
          <p>Для входа в чат выберите способ авторизации</p>
          <button 
            className="auth-button"
            onClick={handleOpenRegistration}
          >
            Войти в чат
          </button>
        </div>
      )}
      
      {/* Модальное окно регистрации */}
      <RegistrationSwitcher 
        isOpen={isRegistrationOpen}
        onClose={handleRegistrationClose}
      />
    </div>
  );
}

export default App;
