import { createSlice } from '@reduxjs/toolkit';
import { TelegramUser } from './../../types/types';

interface UserState {
  user: TelegramUser | null;
}

const initialState: UserState =  {
    user: null
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state, action) => {
      state.user = null;
    }
  }
});

export const { setUser, clearUser } = UserSlice.actions;
export default UserSlice.reducer;