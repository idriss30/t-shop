import React from "react";
import { render, screen } from "@testing-library/react";
import { NavBar } from "./navBar";
import { MemoryRouter } from "react-router-dom";

describe("checking navbar links presence and features", () => {
  test("should render navBar", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    expect(screen.getByText("TSHOP")).toBeInTheDocument();
    expect(screen.getByText("Man")).toBeInTheDocument();
    expect(screen.getByText("Woman")).toBeInTheDocument();
    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "cart.svg");
  });
});
