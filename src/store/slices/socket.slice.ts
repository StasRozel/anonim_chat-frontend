import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  lastPong: number | null;
}

const initialState: SocketState = {
  socket: null,
  isConnected: false,
  connectionError: null,
  lastPong: null,
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<Socket | null>) => {
      state.isConnected = action.payload?.connected || false;
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.connectionError = null;
      }
    },
    setConnectionError: (state, action: PayloadAction<string>) => {
      state.connectionError = action.payload;
      state.isConnected = false;
    },
    clearConnectionError: (state) => {
      state.connectionError = null;
    },
    setPong: (state, action: PayloadAction<number>) => {
      state.lastPong = action.payload;
    },
  },
});

export const {
  setSocket,
  setConnectionStatus,
  setConnectionError,
  clearConnectionError,
  setPong,
} = socketSlice.actions;

export default socketSlice.reducer;