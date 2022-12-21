import { screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { renderWithProviders } from "../../redux/testUtils";
import PageDisplay from "./login";

describe("testing login features", () => {
  test("should render login component", () => {
    renderWithProviders(
      <BrowserRouter>
        <PageDisplay />
      </BrowserRouter>
    );

    const registerTestFirstParagraph = screen.getByText(
      /IF YOU STILL DON'T HAVE A T-SHOP ACCOUNT, USE THIS OPTION TO ACCESS THE REGISTRATION FORM/i
    );
    const registerTestSecondParagraph = screen.getByText(
      /PROVIDE YOUR DETAILS TO MAKE T-SHOP PURCHASES EASIER/i
    );

    const userNameInput = screen.getByPlaceholderText("username");
    const passwordInput = screen.getByPlaceholderText("password");
    const button = screen.getByRole("button", { name: /log in/i });
    const registerLink = screen.getByRole("link", { name: /register/i });

    expect(registerTestFirstParagraph).toBeInTheDocument();
    expect(registerTestSecondParagraph).toBeInTheDocument();
    expect(userNameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
  });
});
