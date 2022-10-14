import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import ProductDisplay from "./singleProductDisplay";
import { renderWithProviders } from "../../redux/testUtils";
import { NavBar } from "../navBar/navBar";
import { MemoryRouter } from "react-router-dom";
import { isCartInSessionStorage } from "../reusable";

// mock window.scrollTo
window.scrollTo = jest.fn();

const sampleProduct = {
  id: 14,
  category: "woman",
  bestSeller: false,
  name: "VENTED COTTON T-SHIRT",
  description:
    "T-shirt made of 100% cotton. Round neck and short sleeves. Side vents at hem.",
  price: 32,
  imageName: "ventedBlue",
};

afterAll(() => {
  // clean window.scrollTO mock
  jest.resetAllMocks();
});

describe("testing singleProduct features", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("can render a single Product", () => {
    renderWithProviders(<ProductDisplay product={sampleProduct} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /material/i
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      sampleProduct.name
    );
    expect(screen.queryAllByRole("img")).toHaveLength(3);
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText(sampleProduct.name)).toBeInTheDocument();
  });

  test("add small size tee-shirt to cart with button click", () => {
    renderWithProviders(
      <MemoryRouter>
        <NavBar />
        <ProductDisplay product={sampleProduct} />
      </MemoryRouter>
    );
    const size = screen.getByRole("listitem", { name: "small" });
    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(size, { target: { innerText: "Small" } });
    fireEvent.click(button);

    const counterDisplay = screen.getByRole("menuitem");
    expect(counterDisplay).toHaveTextContent(1);
    const cart = isCartInSessionStorage();
    const expectedCart = [
      {
        id: sampleProduct.id,
        name: sampleProduct.name,
        img: sampleProduct.imageName,
        quantity: 1,
        size: "small",
        price: sampleProduct.price,
      },
    ];
    expect(JSON.parse(cart)).toEqual(expectedCart);
  });

  test("should display popup when size is not selected", () => {
    renderWithProviders(<ProductDisplay product={sampleProduct} />);
    const addToCartButton = screen.getByRole("button", { name: /add to ca/i });
    fireEvent.click(addToCartButton);

    expect(screen.getByText("please select a size")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "X" })).toBeInTheDocument();
  });
});
