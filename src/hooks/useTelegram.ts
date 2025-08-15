import { useEffect } from 'react';
import { generateRandomUser } from '../utils/generateRandomUser';
import { useAppDispatch, useAppSelector } from './useRedux';
import { setUser } from '../store/slices/user.slice';

export const useTelegram = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const user = tg.initDataUnsafe?.user;
      
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