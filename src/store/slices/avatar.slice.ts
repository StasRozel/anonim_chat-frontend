import { createSlice } from "@reduxjs/toolkit";

export const getAvatarColorSlice = createSlice({
  name: "avatarColor",
  initialState: {
    color: "#3b82f6"
  },
  reducers: {
    getAvatarColor: (state, action) => {
      const userId = action.payload;
      const colors = [
        "#3b82f6", // blue
        "#ef4444", // red
        "#10b981", // green
        "#f59e0b", // amber
        "#8b5cf6", // purple
        "#ec4899", // pink
        "#06b6d4", // cyan
        "#84cc16", // lime
        "#f97316", // orange
        "#6366f1", // indigo
      ];
      state.color = colors[userId % colors.length];
    },
  },
});


export const { getAvatarColor } = getAvatarColorSlice.actions; 
export default getAvatarColorSlice.reducer;