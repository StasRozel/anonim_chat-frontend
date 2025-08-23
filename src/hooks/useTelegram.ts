import { useEffect, useState } from "react";
import { generateRandomUser } from "../utils/generateRandomUser";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { authenticatedUser, setUser } from "../store/slices/user.slice";
import { TelegramUser } from "../types/types";
import { checkUserAuth } from "../utils/checkUserAuth";

export const useTelegram = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();


  const checkAuth = async (user: TelegramUser) => {
    const login = await checkUserAuth(user as TelegramUser);
    console.log("User auth check result:", login);
    if (login.result) {
      dispatch(setUser(login.login));
      dispatch(authenticatedUser(true));
    }
    else dispatch(setUser(user));
  };

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      const user = tg.initDataUnsafe?.user;

      console.log("Telegram user data:", user);

      if (user) {
        checkAuth(user);
      } else {
        dispatch(setUser(generateRandomUser()));
      }

      tg.setHeaderColor("#2481cc");
      tg.expand();
    } else {
      dispatch(setUser(generateRandomUser()));
    }
  }, []);

  return { user, isAuthenticated };
};
