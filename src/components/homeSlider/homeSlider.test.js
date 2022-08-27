import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import HomeSlider from "./homeSlider";
import nock from "nock";

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

afterAll(() => {
  if (!nock.isDone()) {
    nock.cleanAll();
    throw Error("some endpoints were not reached");
  }
});

beforeEach(() => {
  localStorage.clear();
});
describe("testing homeSlider component", () => {
  //
  test("should render the homeSlider and fetch products", async () => {
    nock("http://localhost:5000")
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/shop/products")
      .reply(200, {
        products: items,
      });
    render(<HomeSlider />);

    await waitFor(() => {
      expect(screen.queryAllByRole("img")).toHaveLength(2);
    });
    expect(screen.getByAltText(/zipBlue/i)).toBeInTheDocument();
    expect(screen.getByAltText(/zipBlack/i)).toBeInTheDocument();
  });

  test("can render homeStyle with error popup", async () => {
    nock("http://localhost:5000")
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/shop/products")
      .reply(400, { message: "connection refused" });

    render(<HomeSlider />);
    expect(
      await screen.findByText("can not fetch products")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", "X")).toBeInTheDocument();
  });

  test("can render products from localStorage", async () => {
    localStorage.setItem("products", JSON.stringify(items));

    render(<HomeSlider />);
    await waitFor(() => {
      expect(screen.queryAllByRole("img")).toHaveLength(2);
    });
  });
});
