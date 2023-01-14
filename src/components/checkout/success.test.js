import { screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { renderWithProviders } from "../../redux/testUtils";
import Success from "./success";

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  jest.runAllTimers();
});
afterAll(() => {
  jest.useRealTimers();
});

const cartState = {
  totalProducts: 2,
  products: [
    {
      id: 12,
      name: "Graphic PRINT T-SHIRT",
      img: "black2",
      qty: 1,
      size: "large",
      price: 40,
    },
    {
      id: 19,
      name: "T-SHIRT WITH BUTTONS",
      img: "woman",
      qty: 1,
      size: "large",
      price: 30,
    },
  ],
};

test("can render successFull page component & clean cart store", async () => {
  const { store } = renderWithProviders(
    <BrowserRouter>
      <Success />
    </BrowserRouter>,
    {
      preloadedState: {
        cart: cartState,
      },
    }
  );
  expect(
    screen.getByText(/cleaning up you will be redirected/i)
  ).toBeInTheDocument();
  // wait for store to reset
  await waitFor(() => {
    expect(store.getState()).toEqual({
      cart: { totalProducts: 0, products: [] },
      user: {
        error: null,
        isDeleted: false,
        isItFullFilled: false,
        isLoading: false,
        isLoggedIn: false,
        userInfo: {},
      },
    });
  });
});

test("can redirect to home page after displaying message", () => {
  renderWithProviders(
    <BrowserRouter>
      <Success />
    </BrowserRouter>,
    {
      preloadedState: {
        cart: cartState,
      },
    }
  );

  expect(
    screen.getByText(/cleaning up you will be redirected/i)
  ).toBeInTheDocument();

  expect(screen.queryByRole(/cleaning up/i)).not.toBeInTheDocument();
});
