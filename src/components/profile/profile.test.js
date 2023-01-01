import {
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import nock from "nock";
import { renderWithProviders } from "../../redux/testUtils";
import Profile from "./profile";
import { deleteUser, logoutUser } from "../../redux/userSlice";

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

let userInfo = {
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

let initialLoggedInState = {
  isLoading: false,
  isLoggedIn: true,
  error: null,
  userInfo,
  isItFullFilled: false,
};

const globalState = {
  cart: { totalProducts: 0, products: [] },
  user: {
    isLoading: false,
    isLoggedIn: true,
    error: null,
    userInfo,
    isItFullFilled: false,
  },
};
describe("can handle successfull request", () => {
  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll();
      throw new Error("some endpoints were not reached");
    }
  });
  beforeEach(() => {
    jest.runAllTimers();
  });

  test("successfull user profile rendering", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/users/profile")
      .reply(200, { user: userInfo });

    renderWithProviders(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
      { preloadedState: { user: initialLoggedInState } }
    );

    expect(screen.getByText(/account information/i)).toBeInTheDocument();
    const greetingsUser = `Welcome ${userInfo.firstname},`;
    expect(await screen.findByText(greetingsUser)).toBeInTheDocument();
    expect(
      screen.getByText(/here is what we have on you/i)
    ).toBeInTheDocument();

    expect(screen.getByText(userInfo.email)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${userInfo.address}, ${userInfo.city} ${userInfo.state} ${userInfo.zip}`
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
      .reply(200, { user: userInfo });

    renderWithProviders(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,

      { preloadedState: { user: initialLoggedInState } }
    );

    // wait for endpoint to be reached (async request)
    const greetingsUser = `Welcome ${userInfo.firstname},`;
    expect(await screen.findByText(greetingsUser)).toBeInTheDocument();
    // get update button and assert on it
    const updateButton = screen.getByRole("link", { name: /update/i });
    fireEvent.click(updateButton);
    expect(window.location.pathname).toBe("/users/update");
  });

  test("should successfully log out", async () => {
    // successfull nock rendering
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/users/profile")
      .reply(200, { user: userInfo });

    //mocking signout response for user

    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/users/signout")
      .reply(200, { message: "success" });

    renderWithProviders(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
      { preloadedState: { user: initialLoggedInState } }
    );

    expect(await screen.findByText("Welcome test,")).toBeInTheDocument();

    const logoutButton = screen.getByRole("link", { name: /logout/i });

    fireEvent.click(logoutButton);
    expect(
      await screen.findByText("you are being logged out")
    ).toBeInTheDocument();

    await waitForElementToBeRemoved(() =>
      screen.queryByText("you are being logged out")
    );

    // check redirection
    expect(window.location.pathname).toBe("/");
  });

  test("can successfully delete user", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/users/profile")
      .reply(200, { user: userInfo });

    /*browsers send an OPTIONS request before a DELETE request which return a no match response
    one option to solve this issue would be to run intercept with nock before the delete or 
    add setupEnvironment = node to your test config.
    I choose the first to avoid dealing with ejecting create-react-app
     */

    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .intercept("/api/users/delete/test", "OPTIONS")
      .reply(200, null, {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application:json",
      })
      .delete("/api/users/delete/test")
      .reply(200, { message: "success" });

    const { store } = renderWithProviders(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
      { preloadedState: { user: initialLoggedInState } }
    );

    const welcome = screen.findByText(/welcome test,/i);
    expect(await welcome).toBeInTheDocument();
    expect(store.getState()).toEqual(globalState);
    const deleteButton = screen.getByRole("link", { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(
      await screen.findByText("your account has been deleted")
    ).toBeInTheDocument();

    expect(window.location.pathname).toBe("/");
  });
});

describe("can handle wrong requests", () => {
  beforeEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll();
      throw Error("some endpoints were not reached in error describe");
    }
  });

  beforeEach(() => {
    jest.runAllTimers();
  });

  test("should handle wrong token Error", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/users/profile")
      .reply(403);

    renderWithProviders(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(await screen.findByText("token not valid")).toBeInTheDocument();
  });

  test("should handle connection error", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/users/profile")
      .reply(400);

    renderWithProviders(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(await screen.findByText("network error")).toBeInTheDocument();
  });
});
