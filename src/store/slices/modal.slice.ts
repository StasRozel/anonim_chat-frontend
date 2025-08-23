import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isRegistrationOpen: true,
  },
  reducers: {
    openRegistrationModal: (state) => {
      state.isRegistrationOpen = true;
    },
    closeRegistrationModal: (state) => {
      state.isRegistrationOpen = false;
    },
  },
}); 


export const { openRegistrationModal, closeRegistrationModal } = modalSlice.actions;
export default modalSlice.reducer;