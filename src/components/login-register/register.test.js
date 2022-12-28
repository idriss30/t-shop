import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import nock from "nock";
import Register from "./register";

beforeAll(() => {
  window.scrollTo = jest.fn();
});

describe("testing register component features", () => {
  beforeEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll();
      throw Error("some endpoints were not reached");
    }
  });
  test("can render register component", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const header = screen.getByRole("heading", { name: /register/i });
    expect(header).toBeInTheDocument();
    const form = screen.getByTitle(/register-form/i);
    expect(form).toBeInTheDocument();
    const submitBtn = screen.getByRole("button", { name: /register/i });
    expect(submitBtn).toBeInTheDocument();
    expect(
      screen.getByText(/i agree to the terms and conditions/i)
    ).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(8);
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
  });

  test("should display error on failed register process", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/api/users/register")
      .reply(400, { error: "can not create user" });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const username = screen.getByPlaceholderText("username");
    const first = screen.getByPlaceholderText(/first/i);
    const last = screen.getByPlaceholderText(/last name/i);
    const email = screen.getByPlaceholderText("email");
    const password = screen.getByPlaceholderText("password");
    const address = screen.getByPlaceholderText("address");
    const city = screen.getByPlaceholderText("city");
    const zip = screen.getByPlaceholderText("Zip code");
    const checkBox = screen.getByRole("checkbox", {
      name: /i agree to the terms and conditions/i,
    });

    fireEvent.change(username, { target: { value: "joeDalton" } });
    fireEvent.change(first, { target: { value: "joe" } });
    fireEvent.change(last, { target: { value: "dalton" } });
    fireEvent.change(email, { target: { value: "joeDalton@email.com" } });
    fireEvent.change(password, { target: { value: "pass123" } });
    fireEvent.change(address, { target: { value: "123 dalton st " } });
    fireEvent.change(city, { target: { value: "boston" } });
    fireEvent.change(zip, { target: { value: "12345" } });
    fireEvent.click(checkBox);

    const registerBtn = screen.getByRole("button", { name: /register/i });
    fireEvent.click(registerBtn);

    expect(
      await screen.findByText(/sorry can't create your account try later/i)
    ).toBeInTheDocument();
  });

  test("can register user without error", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/api/users/register")
      .reply(201, { message: "your account was created" });
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    const username = screen.getByPlaceholderText("username");
    const first = screen.getByPlaceholderText(/first/i);
    const last = screen.getByPlaceholderText(/last name/i);
    const email = screen.getByPlaceholderText("email");
    const password = screen.getByPlaceholderText("password");
    const address = screen.getByPlaceholderText("address");
    const city = screen.getByPlaceholderText("city");
    const zip = screen.getByPlaceholderText("Zip code");
    const checkBox = screen.getByRole("checkbox", {
      name: /i agree to the terms and conditions/i,
    });

    fireEvent.change(username, { target: { value: "joeDalton" } });
    fireEvent.change(first, { target: { value: "joe" } });
    fireEvent.change(last, { target: { value: "dalton" } });
    fireEvent.change(email, {
      target: { value: "joeDalton@email.com" },
    });
    fireEvent.change(password, { target: { value: "pass123" } });
    fireEvent.change(address, { target: { value: "123 dalton st " } });
    fireEvent.change(city, { target: { value: "boston" } });
    fireEvent.change(zip, { target: { value: "12345" } });
    fireEvent.click(checkBox);

    const registerBtn = screen.getByRole("button", {
      name: /register/i,
    });
    fireEvent.click(registerBtn);
    expect(
      await screen.findByText("your account was created")
    ).toBeInTheDocument();
  });
});
