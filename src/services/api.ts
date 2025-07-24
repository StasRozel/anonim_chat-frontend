import axios from 'axios';
import { Message, TelegramUser } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const chatAPI = {
  getMessages: async (): Promise<Message[]> => {
    const response = await api.get('/chat/messages');
    return response.data;
  },

  sendMessage: async (text: string, user: TelegramUser): Promise<Message> => {
    const response = await api.post('/chat/messages', { text, user });
    return response.data;
  },
};