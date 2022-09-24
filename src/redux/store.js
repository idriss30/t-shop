import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "../redux/cartSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
});

export const setupTheStore = (initialState) => {
  return configureStore({
    reducer: rootReducer,
    initialState,
  });
};
