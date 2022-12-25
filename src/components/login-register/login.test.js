import { screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { renderWithProviders } from "../../redux/testUtils";
import nock from "nock";
import PageDisplay from "./login";

describe("testing login features", () => {
  beforeEach(() => {
    if (!nock.isDone()) {
      throw new Error("some endpoints were not reached");
    }
    nock.cleanAll();
  });
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

  test("can display error server error on wrong login attempt", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/api/users/login")
      .reply(400);

    renderWithProviders(
      <BrowserRouter>
        <PageDisplay />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText("username");
    fireEvent.change(usernameInput, { target: { value: "john" } });
    const passwordInput = screen.getByPlaceholderText("password");
    fireEvent.change(passwordInput, { target: { value: "wrongPassword" } });
    const form = screen.getByTitle("form");
    fireEvent.submit(form);

    const popupErrorText = screen.findByText(
      /request failed with status code 400/i
    );
    expect(await popupErrorText).toBeInTheDocument();
  });

  test("can handle successful login", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/api/users/login")
      .reply(200, { message: "log in you in" });

    renderWithProviders(
      <BrowserRouter>
        <PageDisplay />
      </BrowserRouter>
    );
    const successInputName = screen.getByPlaceholderText("username");
    fireEvent.change(successInputName, { target: { value: "validUser" } });
    const successInputPassword = screen.getByPlaceholderText("password");
    fireEvent.change(successInputPassword, {
      target: { value: "goodPassword" },
    });

    const submitButton = screen.getByRole("button", { name: /log in/i });
    fireEvent.click(submitButton);

    expect("");
  });
});
