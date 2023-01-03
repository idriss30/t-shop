import {
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import nock from "nock";
import { renderWithProviders } from "../../redux/testUtils";
import Profile from "./profile";

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

describe("testing orders rendering", () => {
  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll();
      throw Error("endpoint not reached");
    }
  });
  test("can render orders components with no orders", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/users/profile")
      .reply(200, { user: userInfo });

    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get(`/api/cart/orders/${userInfo.firstname}`)
      .reply(400);

    renderWithProviders(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
      { preloadedState: { user: initialLoggedInState } }
    );

    expect(screen.getByText(/account information/i)).toBeInTheDocument();
    const greetingsUser = `Welcome ${userInfo.firstname},`;
    expect(await screen.findByText(greetingsUser)).toBeInTheDocument();

    const orderButton = screen.getByRole("link", { name: /orders/i });
    fireEvent.click(orderButton);

    await waitFor(() => {
      expect(
        screen.getByText(/no orders found for your account/i)
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/please visit the store/i)).toBeInTheDocument();
  });

  test("can navigate back to profile page on button click", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/users/profile")
      .reply(200, { user: userInfo });

    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get(`/api/cart/orders/${userInfo.firstname}`)
      .reply(400);

    renderWithProviders(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
      { preloadedState: { user: initialLoggedInState } }
    );

    expect(screen.getByText(/account information/i)).toBeInTheDocument();
    const greetingsUser = `Welcome ${userInfo.firstname},`;
    expect(await screen.findByText(greetingsUser)).toBeInTheDocument();

    const orderButton = screen.getByRole("link", { name: /orders/i });
    fireEvent.click(orderButton);

    await waitFor(() => {
      expect(
        screen.getByText(/no orders found for your account/i)
      ).toBeInTheDocument();
    });

    const goBack = screen.getByRole("link", { name: /go back/i });
    expect(goBack).toBeInTheDocument();
    fireEvent.click(goBack);

    expect(
      screen.queryByRole("heading", { level: 1, name: /orders details/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /go back/i })
    ).not.toBeInTheDocument();

    expect(screen.queryByText("no orders found")).not.toBeInTheDocument();
  });

  test("can render order component with order details", async () => {
    const orderResponse = [
      {
        address: "4 Dalton st",
        city: "boston",
        createdAt: "2022-12-16T22:19:52.000Z",
        email: "dalton@email.com",
        first: "Joe",
        id: "c8f9e8ec-1493-4e61-8d13-9b0f281fd9a5",
        items:
          '{"0":{"id":22,"name":"HALTERNECK BODYSUIT","img":"asia","qty":1,"size":"medium","price":30}}',
        last: "Dalton",
        state: "Ma",
        totalOrder: 30,
        updatedAt: "2022-12-16T22:19:52.000Z",
        userId: "73d02a38-079b-44a0-bb58-098d55ecbde8",
        zip: 12345,
      },
    ];
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/users/profile")
      .reply(200, { user: userInfo });

    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get(`/api/cart/orders/${userInfo.firstname}`)
      .reply(200, { orders: orderResponse });

    renderWithProviders(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
      { preloadedState: { user: initialLoggedInState } }
    );

    expect(screen.getByText(/account information/i)).toBeInTheDocument();
    const greetingsUser = `Welcome ${userInfo.firstname},`;
    expect(await screen.findByText(greetingsUser)).toBeInTheDocument();

    const orderButton = screen.getByRole("link", { name: /orders/i });
    fireEvent.click(orderButton);

    expect(
      await screen.findByRole(
        "heading",
        { level: 1 },
        { name: /orders details/i }
      )
    ).toBeInTheDocument();
    expect(screen.getByText(`${orderResponse.length}`)).toBeInTheDocument();
    const address = `${orderResponse[0].address} ${orderResponse[0].city} ${orderResponse[0].state} ${orderResponse[0].zip}`;
    expect(screen.getByText(/to be delivered at/i)).toBeInTheDocument();
    expect(screen.getByText(address)).toBeInTheDocument();
    expect(
      screen.getByText(`$${orderResponse[0].totalOrder}`)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /halterneck/i })
    ).toBeInTheDocument();
  });
});
