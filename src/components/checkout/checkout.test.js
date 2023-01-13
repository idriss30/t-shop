import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../redux/testUtils";
import { BrowserRouter } from "react-router-dom";
import nock from "nock";
import Checkout from "./checkout";

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

beforeEach(() => {
  if (!nock.isDone()) {
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
  expect(
    screen.getByRole("heading", { level: 1, name: /do you have an account ?/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /here/i })).toBeInTheDocument();
  expect(await screen.findAllByRole("textbox")).toHaveLength(7);
  expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/delivery address/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/city/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/state/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/zip/i)).toBeInTheDocument();

  expect(
    screen.getByRole("button", { name: /place order/i })
  ).toBeInTheDocument();
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
      clientSecret: nock(`${process.env.REACT_APP_URL}`).defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      }),
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

  expect(
    await screen.findByText(`Hello, ${userInfo.firstname}`)
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

test("can handle successful stripe checkout", () => {});

test("can handle unsuccessful stripe checkout", () => {});
