import { useEffect } from 'react';
import { generateRandomUser } from '../utils/generateRandomUser';
import { useAppDispatch, useAppSelector } from './useRedux';
import { setUser } from '../store/slices/user.slice';

export const useTelegram = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  console.log('useTelegram hook initialized, user:', window.Telegram?.WebApp);
  
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      console.log("Telegram user data:", tg);

      const user = tg.initDataUnsafe?.user;

      console.log("Telegram user data:", user);
      
      if (user) {
        dispatch(setUser(tg.initDataUnsafe.user));
      } else {
        dispatch(setUser(generateRandomUser()));
      }

      tg.setHeaderColor('#2481cc');
      tg.expand();
    } else {
      dispatch(setUser(generateRandomUser()));
    }
  }, []);
  
  return { user };
};