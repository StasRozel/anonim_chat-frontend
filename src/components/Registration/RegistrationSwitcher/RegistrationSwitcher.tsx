import React, { useState } from "react";
import "./RegistrationSwitcher.css";
import { RegistrationCustom } from "../RegistrationCustom/RegistrationCustom";
import { RegistrationGenerate } from "../RegistrationGenerate/RegistrationGenerate";
import { RegistrationTelegram } from "../RegistrationTelegram/RegistrationTelegram";
import Modal from "../../ModalWindows/ModalRegistration/ModalRegistration";
import { TelegramUser } from "../../../types/types";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { setChatNickname } from "../../../store/slices/user.slice";

type Mode = "telegram" | "custom" | "generate";

interface RegistrationSwitcherProps {
  onClose: () => void;
}

export const RegistrationSwitcher: React.FC<RegistrationSwitcherProps> = ({
  onClose,
}) => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { isRegistrationOpen } = useAppSelector((state) => state.modal);
  const [currentMode, setCurrentMode] = useState<Mode>("telegram");

  const getModalTitle = () => {
    switch (currentMode) {
      case "telegram":
        return "Вход через Telegram";
      case "custom":
        return "Создать профиль";
      case "generate":
        return "Случайный профиль";
      default:
        return "Авторизация";
    }
  };

  return (
    <Modal
      isOpen={isRegistrationOpen}
      onClose={onClose}
      title={getModalTitle()}
      size="medium"
    >
      <div className="registration-modal-content">
        <div className="tabs">
          <button
            className={`tab ${currentMode === "telegram" ? "active" : ""}`}
            onClick={() => {
              setCurrentMode("telegram");
              dispatch(setChatNickname(''));
            }}
          >
            Telegram
          </button>
          <button
            className={`tab ${currentMode === "custom" ? "active" : ""}`}
            onClick={() => {
              setCurrentMode("custom");
              dispatch(setChatNickname(''));
            }}
          >
            Свой никнейм
          </button>
          <button
            className={`tab ${currentMode === "generate" ? "active" : ""}`}
            onClick={() => {
              setCurrentMode("generate");
              dispatch(setChatNickname(''));
            }}
          >
            Случайный никнейм
          </button>
        </div>

        <div className="tab-content">
          {currentMode === "telegram" && (
            <RegistrationTelegram user={user as TelegramUser} />
          )}
          {currentMode === "custom" && (
            <RegistrationCustom user={user as TelegramUser} />
          )}
          {currentMode === "generate" && (
            <RegistrationGenerate user={user as TelegramUser} />
          )}
        </div>
      </div>
    </Modal>
  );
};
