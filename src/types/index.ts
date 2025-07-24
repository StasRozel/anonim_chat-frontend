export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface Message {
  id: string;
  text: string;
  user: TelegramUser;
  timestamp: Date;
  type: 'text' | 'system';
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        setHeaderColor: (color: string) => void;
        initDataUnsafe: {
          user?: TelegramUser;
          chat_instance?: string;
          auth_date?: number;
        };
      };
    };
  }
}