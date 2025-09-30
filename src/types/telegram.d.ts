interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  setHeaderColor: (color: string) => void;
  platform: string;
  downloadFile?: (params: { url: string; file_name: string }, callback?: (success: boolean) => void) => void;
  openLink?: (url: string) => void;
  showPopup?: (params: {
    title?: string;
    message: string;
    buttons?: Array<{ type?: string; text?: string; id?: string }>;
  }, callback?: (buttonId: string) => void) => void;
  showAlert?: (message: string, callback?: () => void) => void;
  openTelegramLink?: (url: string) => void;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
      photo_url?: string;
    };
    auth_date?: number;
    hash?: string;
  };
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}
