import { createSlice } from '@reduxjs/toolkit';
import { TelegramUser } from './../../types/types';

interface UserState {
  user: TelegramUser | null;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

const initialState: UserState =  {
    user: null,
    isAuthenticated: false
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setChatNickname: (state, action) => {
      if (state.user) {
        state.user.chat_nickname = action.payload;
      }
    },
    authenticatedUser: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    clearUser: (state, action) => {
      state.user = null;
    }
  }
});

export const { setUser, setChatNickname, authenticatedUser, clearUser } = UserSlice.actions;
export default UserSlice.reducer;