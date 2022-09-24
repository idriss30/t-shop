import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { setupTheStore } from "./store";

export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = setupTheStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};
