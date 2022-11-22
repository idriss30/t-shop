import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const writeCookie = (username) =>
  (document.cookie = `user=${username}; max-age=3600; path=/`);
const checkUserCookie = () => {
  const cookiesNameArray = document.cookie.split("=");
  const isCookiePresent = cookiesNameArray.find(
    (element) => element === "user"
  );
  if (isCookiePresent) return true;
  return false;
};

const clearCookie = () => {
  document.cookie = `user=""; max-age=0; path=/`;
  const isCookiePresent = checkUserCookie();
  if (isCookiePresent) {
    document.cookie = `user=""; max-age=0; path=/`;
  }
  return true;
};

const initialState = {
  isLoading: false,
  isLoggedIn: checkUserCookie(),
  error: null,
  userInfo: {},
  isItFullFilled: false,
  isDeleted: false,
};

export const getUser = createAsyncThunk("user/login", async (user) => {
  const loginResponse = await axios.post(
    `${process.env.REACT_APP_URL}/api/users/login`,
    { username: user.username, password: user.password },
    { withCredentials: true }
  );
  return loginResponse.data;
});
export const logoutUser = createAsyncThunk("/user/logout", async () => {
  const signoutResponse = await axios.get(
    `${process.env.REACT_APP_URL}/api/users/signout`,
    { withCredentials: true }
  );
  if (signoutResponse.status === 200) {
    clearCookie();
  }
  return signoutResponse.data;
});

export const deleteUser = createAsyncThunk("/user/delete", async (username) => {
  const deleteRequest = await axios.delete(
    `${process.env.REACT_APP_URL}/api/users/delete/${username}`,
    { withCredentials: true }
  );

  return deleteRequest.data;
});

const reset = (state) => {
  clearCookie();
  state.isItFullFilled = false;
  state.isLoggedIn = checkUserCookie();
  state.error = null;
  state.isLoading = false;
  state.isDeleted = false;
  state.userInfo = {};
};

const resetDeleteUserError = (state) => {
  state.error = null;
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetState: reset,
    resetUserError: resetDeleteUserError,
  },
  extraReducers(builder) {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isItFullFilled = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        writeCookie(action.payload.user.username);
        state.isLoading = false;
        state.isItFullFilled = true;
        state.isLoggedIn = true;
        state.isDeleted = false;
        state.userInfo = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
        state.isItFullFilled = false;
        state.isLoggedIn = checkUserCookie();
        state.isDeleted = false;
        state.userInfo = {};
      });

    builder.addCase(logoutUser.fulfilled, (state) => {
      clearCookie();
      state.isLoading = false;
      state.error = null;
      state.isItFullFilled = true;
      state.isLoggedIn = checkUserCookie();
      state.isDeleted = false;
      state.userInfo = {};
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
      state.isItFullFilled = false;
      state.isLoggedIn = checkUserCookie();
      state.isDeleted = false;
    });
    builder.addCase(deleteUser.fulfilled, (state) => {
      clearCookie();
      state.isItFullFilled = true;
      state.isLoading = false;
      state.error = null;
      state.isLoggedIn = false;
      state.isDeleted = true;
      state.userInfo = {};
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.isItFullFilled = false;
      state.isLoading = false;
      state.error = action.error.message;
      state.isLoggedIn = checkUserCookie();
      state.isDeleted = false;
    });
  },
});
export const { resetState, resetUserError } = userSlice.actions;
export default userSlice.reducer;
