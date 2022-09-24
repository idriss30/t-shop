import React from "react";
import { render, screen } from "@testing-library/react";
import Popup from "./popup";

jest.spyOn(global, "setTimeout");

test("render popup Content", async () => {
  render(<Popup message={"testing rendering"} />);

  expect(screen.getByText(/testing/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "X" })).toBeInTheDocument();
});

test("should wait 2 sec before closing the popup", () => {
  render(<Popup message={"fade"} />);
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 2000);
});
