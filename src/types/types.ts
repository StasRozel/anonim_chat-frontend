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

export interface MessageAttachment {
  id: string;
  originalName: string;
  filename: string;
  url: string;
  thumbnailUrl?: string | null;
  mimetype: string;
  size: number;
  uploadedAt: string;
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
  attachment?: MessageAttachment | null;
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
        downloadFile?: (params: { url: string; file_name: string }, callback?: (success: boolean) => void) => void;
        openLink?: (url: string) => void;
        initDataUnsafe: {
          user?: TelegramUser;
          chat_instance?: string;
          auth_date?: number;
        };
      };
    };
  }
}