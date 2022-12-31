import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "../redux/cartSlice";
import userReducer from "../redux/userSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
});

export const setupTheStore = (preloadedState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};
