import { is } from 'immutable';
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  chat_nickname?: string;
  is_banned?: boolean;
  is_admin?: boolean;
  photo_url: string;
}

export interface Message {
  id: string;
  text: string;
  user: TelegramUser;
  timestamp: string;
  type: 'text' | 'system';
  chatId?: string;
  isPinned: boolean,
  replyTo?: string | null;
  edited?: boolean;
  editedAt?: string;
}

export interface SendMessageData {
  chatId: string;
  message: Omit<Message, 'id' | 'timestamp'>;
}

export interface JoinChatData {
  chatId: string;
  user: TelegramUser;
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