import { createSlice } from "@reduxjs/toolkit";
import { Message } from "../../types/types";

const replyTo = createSlice({
  name: "replyTo",
  initialState: {
    replyToMessageId: null as string | null,
    message: null as Message | null,
  },
  reducers: {
    setReplyToMessage: (state, action) => {
      state.replyToMessageId = action.payload;
    },
    clearReplyToMessage: (state) => {
      state.replyToMessageId = null;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
});

export const { setReplyToMessage, clearReplyToMessage, setMessage, clearMessage } = replyTo.actions;
export default replyTo.reducer;