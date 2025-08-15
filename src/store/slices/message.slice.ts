import { createSlice } from "@reduxjs/toolkit";
import { Message } from "../../types/types";

export const MessageSlice = createSlice({
  name: "message",
  initialState: {
    isEditMessage: false,
    message: null as Message | null
  },
  reducers: {
    setEditMessage: (state, action) => {
      state.isEditMessage = action.payload;
    }
  }
});

export const { setEditMessage } = MessageSlice.actions;
export default MessageSlice.reducer;