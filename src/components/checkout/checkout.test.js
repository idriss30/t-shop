import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../redux/testUtils";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import nock from "nock";
import Checkout from "./checkout";
import App from "../../App";

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

let initialUserLoggedInState = {
  isLoading: false,
  isLoggedIn: true,
  error: null,
  userInfo: {},
  isItFullFilled: false,
};

let noUserState = {
  isLoading: false,
  isLoggedIn: false,
  error: null,
  userInfo: {},
  isItFullFilled: false,
};

const cartState = {
  totalProducts: 2,
  products: [
    {
      id: 18,
      name: "SHORT SLEEVE RIBBED T-SHIRT",
      img: "fourth",
      qty: 1,
      size: "large",
      price: 32,
    },
    {
      id: 22,
      name: "HALTERNECK BODYSUIT",
      img: "asia",
      qty: 1,
      size: "large",
      price: 30,
    },
  ],
};

beforeAll(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runAllTimers();
});
afterAll(() => {
  jest.useRealTimers();
  localStorage.clear();
});

describe("render without mocking stripe", () => {
  afterEach(() => {
    jest.runAllTimers();
  });
  afterEach(() => {
    if (!nock.isDone()) {
      console.log(nock.activeMocks());
      nock.cleanAll();
      throw Error("some endpoints were not reached");
    }
  });

  test("can render checkout form without user", async () => {
    //mocking payment intent request to server
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/api/stripe/paymentIntent")
      .reply(201, {
        clientSecret:
          "pi_1Dstq32eZvKYlo2CShnP61Sg_secret_FAuC6DTX3Tnpfm9E7E6fg0HAb",
      });

    //not checking stripe rendering
    renderWithProviders(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>,
      {
        preloadedState: {
          cart: cartState,
          user: noUserState,
        },
      }
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /do you have an account ?/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /here/i })).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/delivery address/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/city/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/state/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/zip/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /card information/i })
    ).toBeInTheDocument();
    expect(screen.getByText("4242424242424242")).toBeInTheDocument();
    expect(screen.getByText("4000000000009995")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /place order/i })
    ).toBeInTheDocument();
  });

  test("can update form filled", async () => {
    //mocking payment intent request to server
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/api/stripe/paymentIntent")
      .reply(201, {
        clientSecret:
          "pi_1Dstq32eZvKYlo2CShnP61Sg_secret_FAuC6DTX3Tnpfm9E7E6fg0HAb",
      });

    //not checking stripe rendering
    renderWithProviders(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>,
      {
        preloadedState: {
          cart: cartState,
          user: noUserState,
        },
      }
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });
    fireEvent.change(screen.getByPlaceholderText(/first/i), {
      target: { value: "joe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/last/i), {
      target: { value: "dalton" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "dalton@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/delivery/i), {
      target: { value: "123 boston st" },
    });
    fireEvent.change(screen.getByPlaceholderText(/city/i), {
      target: { value: "seattle" },
    });
    fireEvent.change(screen.getByPlaceholderText(/state/i), {
      target: { value: "Wa" },
    });
    fireEvent.change(screen.getByPlaceholderText(/zip/i), {
      target: { value: "12345" },
    });

    expect(screen.getByPlaceholderText(/first/i).value).toEqual("joe");
    expect(screen.getByPlaceholderText(/last/i).value).toEqual("dalton");
    expect(screen.getByPlaceholderText(/email/i).value).toEqual(
      "dalton@email.com"
    );
    expect(screen.getByPlaceholderText(/delivery/i).value).toEqual(
      "123 boston st"
    );
    expect(screen.getByPlaceholderText(/city/i).value).toEqual("seattle");
    expect(screen.getByPlaceholderText(/state/i).value).toEqual("Wa");
    expect(screen.getByPlaceholderText(/zip/i).value).toEqual("12345");
  });

  test("can render checkout form with user info", async () => {
    //mocking fetch userInfo details
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/users/profile")
      .reply(200, { user: userInfo });

    //mocking stripe paymentIntent request
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/api/stripe/paymentIntent")
      .reply(201, {
        clientSecret:
          "pi_1Dstq32eZvKYlo2CShnP61Sg_secret_FAuC6DTX3Tnpfm9E7E6fg0HAb",
      });

    //not checking stripe rendering
    renderWithProviders(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>,
      {
        preloadedState: {
          cart: cartState,
          user: initialUserLoggedInState,
        },
      }
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });
    expect(
      screen.getByText(`Hello, ${userInfo.firstname}`)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(userInfo.lastname)).toBeInTheDocument();
    expect(screen.getByDisplayValue(userInfo.email)).toBeInTheDocument();
    expect(screen.getByDisplayValue(userInfo.address)).toBeInTheDocument();
    expect(screen.getByDisplayValue(userInfo.city)).toBeInTheDocument();
    expect(screen.getByDisplayValue(userInfo.state)).toBeInTheDocument();
    expect(screen.getByDisplayValue(userInfo.zip)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /place order/i })
    ).toBeInTheDocument();
  });

  test("can redirect when total Products is 0 and tokenError", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/api/stripe/paymentIntent")
      .reply(400);
    renderWithProviders(
      <MemoryRouter initialEntries={["/checkout"]}>
        <App />
      </MemoryRouter>,
      {
        preloadedState: {
          cart: { totalProducts: 0, products: [] },
          user: noUserState,
        },
      }
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /do you have an account ?/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/request failed/i)).toBeInTheDocument();

    // set products to localstorage to avoid fetching from server when redirecting (avoid mock)
    localStorage.setItem("products", JSON.stringify(cartState.products));
    // runing pending timers to simulate activate redirect
    act(() => {
      jest.runAllTimers();
    });
    //testing that element has been removed
    expect(
      screen.queryByRole("heading", {
        name: /do you have an account ?/i,
      })
    ).not.toBeInTheDocument();

    //check only that logo is display
    expect(screen.getByRole("link", { name: /tshop/i })).toBeInTheDocument();

    expect(window.location.pathname).toBe("/");
  });
});
// mocking stripe for next tests
const mockingElement = {
  mount: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn(),
};

const mockingElements = {
  create: jest.fn(() => Promise.resolve(mockingElement)),
  getElement: jest.fn(() => Promise.resolve(mockingElement)),
};

const mockStripe = {
  elements: jest.fn(() => mockingElements),
  createToken: jest.fn(),
  createPaymentMethod: jest.fn(),
  confirmCardPayment: jest.fn(),
};

const loggedInStateWithprefilledInfo = {
  isLoading: false,
  isLoggedIn: true,
  error: null,
  userInfo,
  isItFullFilled: false,
};

jest.mock("@stripe/react-stripe-js", () => {
  const stripe = jest.requireActual("@stripe/react-stripe-js");

  return {
    ...stripe,
    Element: () => {
      return mockingElement;
    },
    useStripe: () => {
      return mockStripe;
    },
    useElements: () => {
      return mockingElements;
    },
  };
});
describe("mocking stripe to handle payments request", () => {
  afterEach(() => {
    if (!nock.isDone()) {
      console.log(nock.activeMocks());
      nock.cleanAll();
      throw Error("some endpoints were not reached");
    }
  });

  test("logged in user with erronous payment info", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/api/stripe/paymentIntent")
      .reply(201, {
        clientSecret:
          "pi_1Dstq32eZvKYlo2CShnP61Sg_secret_FAuC6DTX3Tnpfm9E7E6fg0HAb",
      });
    renderWithProviders(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>,
      {
        preloadedState: {
          cart: cartState,
          user: loggedInStateWithprefilledInfo,
        },
      }
    );
    //
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    // mocking error response
    mockStripe.confirmCardPayment.mockResolvedValue({
      error: {
        message: "insufficients funds",
      },
    });

    const form = screen.getByTitle("checkout-form");
    fireEvent.submit(form);
    expect(mockStripe.confirmCardPayment).toHaveBeenCalled();
    expect(await screen.findByText("insufficients funds")).toBeInTheDocument();
    expect(nock.isDone()).toBe(true);
  });

  test("logged in User successful payment and database save", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/api/stripe/paymentIntent")
      .reply(201, {
        clientSecret:
          "pi_1Dstq32eZvKYlo2CShnP61Sg_secret_FAuC6DTX3Tnpfm9E7E6fg0HAb",
      });

    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/api/cart/orders")
      .reply(201, { message: "success" });

    renderWithProviders(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>,
      {
        preloadedState: {
          cart: cartState,
          user: loggedInStateWithprefilledInfo,
        },
      }
    );
    //
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });
    // mocking error response
    mockStripe.confirmCardPayment.mockResolvedValue({
      paymentIntent: {
        status: "succeeded",
      },
    });
    const form = screen.getByTitle("checkout-form");
    fireEvent.submit(form);
    expect(mockStripe.confirmCardPayment).toHaveBeenCalled();
    expect(
      await screen.findByText(/your order has been placed/i)
    ).toBeInTheDocument();
    //check if it will redirect to successfull page
    act(() => {
      jest.runOnlyPendingTimers();
    });
    // check  if redirect was called
    expect(window.location.pathname).toEqual("/success");
  });
});
