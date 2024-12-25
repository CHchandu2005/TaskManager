import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  user: null,
  isSidebarOpen: false,
};

// Slice definition

// console.log("Authslice component");
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setUser, logout, setOpenSidebar } = authSlice.actions;


export default authSlice.reducer;



