import { createSlice } from "@reduxjs/toolkit";
import { TelegramUser } from "../../types/types";

const usersSlice = createSlice({
    name: "users",
    initialState: {
        users: [] as TelegramUser[],
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        updUser: (state, action) => {
            const updatedUser = action.payload;
            const index = state.users.findIndex(user => user.id === updatedUser.id);
            if (index !== -1) {
                state.users[index] = updatedUser;
            } else {
                state.users.push(updatedUser);
            }
        }
    }
});

export const { setUsers, updUser } = usersSlice.actions;
export default usersSlice.reducer;