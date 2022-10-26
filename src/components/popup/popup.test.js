import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Popup from "./popup";

test("render popup Content", async () => {
  render(<Popup message={"testing rendering"} />);

  expect(screen.getByText(/testing/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "X" })).toBeInTheDocument();
});

test("should close the popup by passing a remove function", () => {
  const remove = () => {
    const popup = screen.getByLabelText("popup");
    popup.style.display = "none";
  };
  render(<Popup message={"testing close button"} remove={remove} />);

  expect(screen.getByText(/testing/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "X" })).toBeInTheDocument();

  const removeButton = screen.getByRole("button", { name: "X" });
  fireEvent.click(removeButton);
  const popup = screen.getByLabelText("popup");
  expect(popup).not.toBeVisible();
});
