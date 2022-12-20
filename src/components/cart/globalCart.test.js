import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { Cart } from "./cart";
import { setupTheStore } from "../../redux/store";
import { add, increment } from "../../redux/cartSlice";
import { renderWithProviders } from "../../redux/testUtils";
import { BrowserRouter } from "react-router-dom";

const cartProduct = {
  id: 22,
  name: "HALTERNECK BODYSUIT",
  imageName: "asia",
  size: "medium",
  price: 30,
};

const productToDelete = {
  id: 18,
  name: "SHORT SLEEVE RIBBED T-SHIRT",
  imageName: "fourth",
  size: "xl",
  price: 32,
};

describe("testing cart features", () => {
  beforeEach(() => sessionStorage.clear());
  afterAll(() => sessionStorage.clear());

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
    const totalAmounts = screen.getByTitle("total");
    expect(productImg).toBeInTheDocument();
    expect(productQtys).toHaveLength(1);
    expect(buttons).toHaveLength(3);
    expect(totalAmounts).toHaveTextContent(`$${cartProduct.price}`);
    expect(productTitle).toBeInTheDocument();
  });

  test("can delete one item from the cart", async () => {
    // create a new cart with 2 items in it
    const deleteStore = setupTheStore();
    deleteStore.dispatch(add(cartProduct));
    deleteStore.dispatch(add(productToDelete));
    renderWithProviders(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
      { store: deleteStore }
    );
    expect(screen.queryAllByRole("img")).toHaveLength(2);
    expect(screen.getByTitle("item-quantity")).toHaveTextContent(2);
    expect(screen.getByTitle("total")).toHaveTextContent(
      cartProduct.price + productToDelete.price
    );
    //select the two delete buttons and extract the one to delete
    const deleteButtons = screen.getAllByRole("button", { name: /x/i });
    const lastButton = deleteButtons[1]; // there is only two buttons
    fireEvent.click(lastButton);

    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByTitle("item-quantity")).toHaveTextContent(1);
    expect(screen.getByTitle("total")).toHaveTextContent(cartProduct.price);
  });

  test("can increase quantity of an item", () => {
    const increaseStore = setupTheStore();
    increaseStore.dispatch(add(cartProduct));
    renderWithProviders(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
      { store: increaseStore }
    );
    const initialItemQty = screen.getByTitle("item-quantity");
    const initialTotal = screen.getByTitle("total");
    expect(initialItemQty).toHaveTextContent(1);
    expect(initialTotal).toHaveTextContent(cartProduct.price);

    const increaseButton = screen.getByRole("button", { name: /\+/i });
    fireEvent.click(increaseButton);
    const finalQty = screen.getByTitle("item-quantity");
    const finalTotal = screen.getByTitle("total");
    expect(finalQty).toHaveTextContent(2);
    expect(finalTotal).toHaveTextContent(cartProduct.price * 2);
  });

  test("can decrease quantity of an item", () => {
    const decreaseStore = setupTheStore();
    decreaseStore.dispatch(add(cartProduct));
    decreaseStore.dispatch(increment(cartProduct));
    renderWithProviders(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
      { store: decreaseStore }
    );
    expect(screen.getByTitle("item-quantity")).toHaveTextContent(2);
    fireEvent.click(screen.getByRole("button", { name: /-/i }));
    const finalQty = screen.getByTitle("item-quantity");
    expect(finalQty).toHaveTextContent(1);
  });
});
