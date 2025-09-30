import { useEffect, useState } from "react";
import { generateRandomUser } from "../utils/generateRandomUser";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { authenticatedUser, setUser } from "../store/slices/user.slice";
import { TelegramUser } from "../types/types";
import { checkUserAuth } from "../utils/checkUserAuth";
import { logger } from "../utils/logger";

export const useTelegram = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [inTelegram, setInTelegram] = useState(false);

  const checkAuth = async (user: TelegramUser) => {
    try {
      logger.info("Checking user authentication...");
      const login = await checkUserAuth(user as TelegramUser);
      console.log("User auth check result:", login);
      logger.info(`Auth check result: ${login.result ? "SUCCESS" : "FAILED"}`);

      if (login.result) {
        logger.success("User authenticated successfully");
        dispatch(setUser(login.login));
        dispatch(authenticatedUser(true));
      } else {
        logger.warn("User not found in database, need registration");
        user.is_admin = false;
        user.is_banned = false;
        dispatch(setUser(user));
        dispatch(authenticatedUser(false));
      }
    } catch (error) {
      logger.error("Auth check error", error);
      console.error("Auth check error:", error);
      dispatch(setUser(user));
      dispatch(authenticatedUser(false));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeTelegram = async () => {
      if (window.Telegram?.WebApp) {
        const tgAny = window.Telegram.WebApp as any; // Используем any для доступа к недокументированным методам
        setInTelegram(true);
        logger.info("Telegram WebApp detected");

        try {
          // Уведомляем Telegram, что приложение готово
          tgAny.ready();
          logger.info("Telegram WebApp.ready() called");

          //tgAny.expand();
          logger.info("WebApp expanded and header color set");

          // Пытаемся получить пользователя с повторными попытками
          let attempts = 0;
          const maxAttempts = 10;
          logger.info("Starting user authentication attempts...");

          const tryGetUser = () => {
            attempts++;
            const user = tgAny.initDataUnsafe?.user;

            logger.info(
              `Attempt ${attempts}/${maxAttempts}: Checking for user data`
            );
            console.log(`Attempt ${attempts}: Telegram user data:`, user);

            if (user) {
              logger.success(
                `User data found on attempt ${attempts}: ${
                  user.first_name || "No name"
                }`
              );
              checkAuth(user);
              return true;
            }

            if (attempts >= maxAttempts) {
              logger.warn(
                `Max attempts (${maxAttempts}) reached, generating random user`
              );
              console.warn("Max attempts reached, generating random user");
              dispatch(setUser(generateRandomUser()));
              setLoading(false);
              return true;
            }

            logger.info(`Attempt ${attempts} failed, retrying...`);
            return false;
          };

          // Первая попытка сразу
          if (!tryGetUser()) {
            logger.info("First attempt failed, setting up retry interval");
            // Если не получилось, пытаемся каждые 200ms
            const interval = setInterval(() => {
              if (tryGetUser()) {
                logger.success("User authentication successful via retry");
                clearInterval(interval);
              }
            }, 200);

            // Очистка интервала при размонтировании
            return () => clearInterval(interval);
          } else {
            logger.success("User authentication successful on first attempt");
          }
        } catch (error) {
          logger.error("Telegram WebApp initialization error", error);
          console.error("Telegram WebApp initialization error:", error);
          dispatch(setUser(generateRandomUser()));
          setLoading(false);
        }
      } else {
        // Открыто вне Telegram
        logger.info(
          "Not running in Telegram environment, generating random user"
        );
        console.log("Not in Telegram, generating random user");
        setInTelegram(false);
        dispatch(setUser(generateRandomUser()));
        setLoading(false);
      }
    };
    initializeTelegram();
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    inTelegram,
  };
};
