//This slice deals with local storage. On login it takes the user data gotten from the API and stores it in the local storage and the AUTH state. The token isn't stored, it is in the HTTP-ONLY cookie. It will also destroy the user data from the local storage on logout.

import { createSlice } from "@reduxjs/toolkit";

// Initial state: Check for user info in local storage, if found, convert to a javascript object, then use it else return null
const initialState = {
  userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  // This is an object with reducer functions
  reducers: {
    // Function to set user information to local storage on login. This is an ACTION.
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    // Function to delete user information from local storage on logout. This is an ACTION.
    deleteCredentials: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, deleteCredentials } = authSlice.actions;

export default authSlice.reducer;
