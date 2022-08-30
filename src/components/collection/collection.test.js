import React from "react";
import { render, screen } from "@testing-library/react";
import Collection from "./collection";

beforeEach(() => {
  localStorage.clear();
});

afterAll(() => {
  localStorage.clear();
});
describe("testing collection components", () => {
  const products = [
    {
      id: 1,
      category: "man",
      bestSeller: false,
      name: "ZIP MOCK NECK T-SHIRT",
      description: "Mock neck T-shirt with front zip closure and short sleeves",
      price: 40,
      imageName: "zipBlack",
    },
    {
      id: 2,
      category: "man",
      bestSeller: false,
      name: "ZIP MOCK NECK T-SHIRT",
      description: "Mock neck T-shirt with front zip closure and short sleeves",
      price: 40,
      imageName: "zipBlue",
    },
  ];

  test("can render collection items from localStorage", () => {
    localStorage.setItem("products", JSON.stringify(products));
    render(<Collection />);
    expect(screen.queryAllByRole("img")).toHaveLength(2);
    expect(screen.getByAltText(/zipBlue/i)).toBeInTheDocument();
    expect(screen.getByAltText(/zipBlack/i)).toBeInTheDocument();
  });

  test("can display error component when localStorage is empty", () => {
    render(<Collection />);
    expect(screen.getByRole("button", "X")).toBeInTheDocument();
    expect(screen.getByText("problem fetching products")).toBeInTheDocument();
  });
});
