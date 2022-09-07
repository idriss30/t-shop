import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomeSlider from "./homeSlider";

const items = [
  {
    id: 1,
    category: "man",
    bestSeller: true,
    name: "ZIP MOCK NECK T-SHIRT",
    description: "Mock neck T-shirt with front zip closure and short sleeves",
    price: 40,
    imageName: "zipBlack",
  },
  {
    id: 2,
    category: "man",
    bestSeller: true,
    name: "ZIP MOCK NECK T-SHIRT",
    description: "Mock neck T-shirt with front zip closure and short sleeves",
    price: 40,
    imageName: "zipBlue",
  },
];

test("should render the homeSlider", () => {
  render(
    <MemoryRouter>
      <HomeSlider products={items} />
    </MemoryRouter>
  );

  expect(screen.queryAllByRole("img")).toHaveLength(2);
  expect(screen.getByAltText(/zipBlue/i)).toBeInTheDocument();
  expect(screen.getByAltText(/zipBlack/i)).toBeInTheDocument();
});
