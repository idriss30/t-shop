import React from "react";
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import Minicart from "./miniCart";
import { renderWithProviders } from "../../redux/testUtils";
import { MemoryRouter } from "react-router-dom";
import { setupTheStore } from "../../redux/store";
import { add } from "../../redux/cartSlice";

describe("testing minicart features", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });
  const hideCart = () => {
    const section = screen.getByRole("complementary", { name: "section" });
    return (section.style.display = "none");
  };

  const products = {
    id: 20,
    name: "V-NECK T-SHIRT",
    size: "medium",
    price: 30,
    imageName: "vneck",
  };

  test("can render miniCart", () => {
    const store = setupTheStore();
    store.dispatch(add(products));
    renderWithProviders(
      <MemoryRouter>
        <Minicart hideMiniCart={hideCart} />
      </MemoryRouter>,
      { store }
    );

    expect(
      screen.getByRole("img", { name: products.name })
    ).toBeInTheDocument();
    expect(screen.getByText(`Quantity : 1`)).toBeInTheDocument();
    expect(screen.getByText(`$${products.price}`)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /go to cart/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "X" })).toBeInTheDocument();
    expect(screen.getByAltText("garbage icon")).toBeInTheDocument();
  });

  test("can delete item successfully and close cart", () => {
    const store = setupTheStore();
    store.dispatch(add(products));
    renderWithProviders(
      <MemoryRouter>
        <Minicart hideMiniCart={hideCart} />
      </MemoryRouter>,
      { store }
    );
    const deleteButton = screen.getByAltText("garbage icon");
    fireEvent.click(deleteButton);

    expect(
      screen.queryByRole("img", { name: products.imageName })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(`Quantity : 1`)).not.toBeInTheDocument();
  });

  test("should close cart when close button is clicked", async () => {
    renderWithProviders(
      <MemoryRouter>
        <Minicart hideMiniCart={hideCart} />
      </MemoryRouter>
    );
    const closeButton = screen.getByRole("button", { name: "X" });
    fireEvent.click(closeButton);
    // assert that the whole section got removed from the dom
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("complementary", { name: "section" })
    );
  });
});
