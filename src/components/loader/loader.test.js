import React from "react";
import { render, screen } from "@testing-library/react";
import Loader from "./loader";

test("render the loading element", () => {
  render(<Loader />);
  expect(screen.getByTestId("loader")).toBeInTheDocument();
});
