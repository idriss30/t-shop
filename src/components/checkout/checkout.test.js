import { screen, fireEvent } from "@testing-library/react";
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
  userInfo,
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

test("can render checkout form without user", async () => {
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
});

test("can render checkout form with user info", () => {
  //not checking stripe rendering
});

test("can handle successful stripe checkout", () => {});

test("can handle unsuccessful stripe checkout", () => {});
