import { createSlice } from "@reduxjs/toolkit";
import { Message } from "../../types/types";

interface ContextMenuState {
    isOpen: boolean;
    position: { x: number; y: number } | null;
    message: Message | null;
}

const initialState: ContextMenuState = {
    isOpen: false,
    position: null,
    message: null,
};

export const contextMenuSlice = createSlice({
    name: "contextMenu",
    initialState,
    reducers: {
        showContextMenu: (state, action) => {
            state.position = action.payload.position;
            state.message = action.payload.message;
            state.isOpen = true;
        },
        hideContextMenu: (state) => {
            state.isOpen = false;
            state.position = null;
            state.message = null;
        },
    }
})


export const { showContextMenu, hideContextMenu } = contextMenuSlice.actions;
export default contextMenuSlice.reducer;