import React from "react";
import { screen } from "@testing-library/react";
import { Cart } from "./cart";
import { setupTheStore } from "../../redux/store";
import { add } from "../../redux/cartSlice";
import { renderWithProviders } from "../../redux/testUtils";
import { BrowserRouter } from "react-router-dom";

const cartProduct = {
  id: 22,
  name: "HALTERNECK BODYSUIT",
  imageName: "asia",
  size: "medium",
  price: 30,
};

describe("testing cart features", () => {
  beforeEach(() => sessionStorage.clear());

  const store = setupTheStore();
  store.dispatch(add(cartProduct));

  test("can render the Cart", () => {
    renderWithProviders(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
      { store }
    );

    const productImg = screen.getByRole("img", { name: /asia/i });
    const productTitle = screen.getByText(`${cartProduct.name}`);
    const productQtys = screen.getAllByText("1");
    const buttons = screen.getAllByRole("button"); // expected to have a length of including checkout button;
    const totalAmounts = screen.getAllByText(`$${cartProduct["price"]}`);
    expect(productImg).toBeInTheDocument();
    expect(productQtys).toHaveLength(2);
    expect(buttons).toHaveLength(4);
    expect(totalAmounts).toHaveLength(2);
    expect(productTitle).toBeInTheDocument();
  });

  test("can delete one item from the cart");
});
