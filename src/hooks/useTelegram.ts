import { useState, useEffect } from 'react';
import { TelegramUser } from '../types';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#2481cc');

      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
      
      setIsReady(true);
    } else {
      // Для разработки
      setUser({
        id: Math.floor(Math.random() * 1000000),
        first_name: 'Developer',
        username: 'dev_user'
      });
      setIsReady(true);
    }
  }, []);

  return { user, isReady };
};