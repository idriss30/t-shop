import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const calculateOneHour = () => new Date(1 * 3600 * 1000);
const writeCookie = (username) =>
  document.cookie(`user=${username}; expires = ${calculateOneHour()}`);
const checkUserCookie = () => {
  const cookiesNameArray = document.cookie.split("=");
  const isCookiePresent = cookiesNameArray.find(
    (element) => element === "user"
  );
  if (isCookiePresent) return true;
  return false;
};

const initialState = {
  isLoading: false,
  isLoggedIn: checkUserCookie(),
  userInfo: {},
  error: false,
  isItFullFilled: false,
};

export const getUser = createAsyncThunk("user/login", async (user) => {
  const loginResponse = await axios.post(
    `${process.env.REACT_APP_URL}/api/users/login`,
    { username: user.username, password: user.password },
    { withCredentials: true }
  );
  return loginResponse.data;
});
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    update: () => null,
    logout: () => null,
    deleteUser: () => null,
  },
  extraReducers(builder) {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = false;
        state.isItFullFilled = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        writeCookie(action.payload.user.username);
        state.isLoading = false;
        state.isItFullFilled = true;
        state.userInfo = { ...action.payload.user };
        state.error = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.error = true;
        state.isLoading = false;
        state.isItFullFilled = false;
      });
  },
});
export const { update, logout, deleteUser } = userSlice.actions;
export default userSlice.reducer;
