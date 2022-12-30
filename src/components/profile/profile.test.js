import { screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import nock from "nock";
import { renderWithProviders } from "../../redux/testUtils";
import Profile from "./profile";

describe("testing profile features", () => {
  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll();
      throw Error("some endpoints not reached! check config");
    }
  });

  const user = {
    username: "test",
    firstname: "test",
    lastname: "tester",
    email: "test@email.com",
    password: "test",
    address: "123 my apt",
    city: "boston",
    state: "massachusetts",
    zip: 12345,
  };

  test("successfull user profile rendering", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/users/profile")
      .reply(200, { user });

    renderWithProviders(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    expect(screen.getByText(/account information/i)).toBeInTheDocument();
    const greetingsUser = `Welcome ${user.firstname},`;
    expect(await screen.findByText(greetingsUser)).toBeInTheDocument();
    expect(
      screen.getByText(/here is what we have on you/i)
    ).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${user.address}, ${user.city} ${user.state} ${user.zip}`
      )
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });

  test("can redirect to update profile on button click", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/users/profile")
      .reply(200, { user });

    renderWithProviders(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    // wait for endpoint to be reached (async request)
    const greetingsUser = `Welcome ${user.firstname},`;
    expect(await screen.findByText(greetingsUser)).toBeInTheDocument();

    // get update button and assert on it
    const updateButton = screen.getByRole("link", { name: /update/i });
    fireEvent.click(updateButton);
    expect(window.location.pathname).toEqual("/users/update");
  });
});
