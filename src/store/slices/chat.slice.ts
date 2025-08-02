import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../types/types";
interface ChatState {
  messages: Message[];
  inputText: string;
  isConnected: boolean;
  currentChatId: string;
}

const initialState: ChatState = {
  messages: [
    {
      id: '1',
      text: 'Добро пожаловать в чат! 👋',
      user: { id: 0, first_name: 'Система' },
      timestamp: new Date().toISOString(),
      type: 'system'
    }
  ],
  inputText: '',
  isConnected: false,
  currentChatId: 'general-chat'
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setInputText: (state, action: PayloadAction<string>) => {
      state.inputText = action.payload;
    },
    clearInputText: (state) => {
      state.inputText = '';
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      // Преобразуем Date в строку при добавлении
      const messageWithStringTimestamp = {
        ...action.payload,
        timestamp: action.payload.timestamp
      };
      state.messages.push(messageWithStringTimestamp);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      // Преобразуем все Date в строки
      state.messages = action.payload.map((msg: Message) => ({
        ...msg,
        timestamp: msg.timestamp 
      }));
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setChatId: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload;
    }
  },
});


export const { 
  setInputText, 
  clearInputText, 
  addMessage, 
  setMessages, 
  setConnectionStatus, 
  setChatId 
} = chatSlice.actions;

export default chatSlice.reducer;