import { useState, useEffect } from 'react';
import { TelegramUser } from '../types/types';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  
  // Функция для генерации случайного имени пользователя
  const generateRandomUser = () => {
    const adjectives = ['Смелый', 'Умный', 'Быстрый', 'Добрый', 'Веселый', 'Мудрый', 'Сильный', 'Ловкий', 'Храбрый', 'Честный'];
    const nouns = ['Волк', 'Лев', 'Орел', 'Дракон', 'Тигр', 'Медведь', 'Сокол', 'Пантера', 'Феникс', 'Барс'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 9999) + 1;
    
    return {
      id: Date.now() + Math.floor(Math.random() * 1000), // Уникальный ID
      first_name: `${randomAdjective}${randomNoun}`,
      username: `user${randomNumber}`
    };
  };
  
  useEffect(() => {
    // Проверяем, запущено ли приложение в Telegram
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      
      // Устанавливаем пользователя из Telegram
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      } else {
        // Для тестирования вне Telegram - генерируем случайного пользователя
        setUser(generateRandomUser());
      }
      
      // Настраиваем тему
      tg.setHeaderColor('#2481cc');
      tg.expand();
    } else {
      // Для разработки вне Telegram - генерируем случайного пользователя
      setUser(generateRandomUser());
    }
  }, []);
  
  return { user };
};