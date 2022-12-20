import React from "react";
import { screen } from "@testing-library/react";
import { NavBar } from "./navBar";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "../../redux/testUtils";

describe("checking navbar links presence and features", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });
  test("should render navBar", () => {
    renderWithProviders(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    expect(screen.getByText("TSHOP")).toBeInTheDocument();
    expect(screen.getByText(/Man/)).toBeInTheDocument();
    expect(screen.getByText(/Woman/)).toBeInTheDocument();
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "cart.svg");
  });
});
