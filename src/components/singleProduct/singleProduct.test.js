import React from "react";
import { renderWithProviders } from "../../redux/testUtils";
import { screen } from "@testing-library/react";
import { saveProductsToLocalStorage } from "../reusable";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SingleProduct from "./singleProduct";
import nock from "nock";

window.scrollTo = jest.fn(); // ignore the scrolling by not returning anything

afterAll(() => {
  jest.resetAllMocks();
});

beforeEach(() => {
  localStorage.clear();
});
describe("testing single Products render case scenarios", () => {
  const product = {
    id: 12,
    category: "man",
    bestSeller: false,
    name: "Graphic PRINT T-SHIRT",
    description:
      "Round neck T-shirt with short sleeves. Front contrast prints of embroidery.",
    price: 40,
    imageName: "black2",
  };

  test("can fetch from localStorage", () => {
    saveProductsToLocalStorage([product]);
    const route = `/shop/${product.imageName}`;
    renderWithProviders(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/shop/:productName" element={<SingleProduct />}></Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /material/i
    );
    expect(screen.queryAllByRole("img")).toHaveLength(3);
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  test("can render by getting product from the server with no error", async () => {
    const baseFetchUrl = nock(`${process.env.REACT_APP_URL}`);
    baseFetchUrl
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/shop/products")
      .reply(200, { products: [product] });
    const route = `/shop/${product.imageName}`;
    renderWithProviders(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/shop/:productName" element={<SingleProduct />}></Route>
        </Routes>
      </MemoryRouter>
    );
    expect(
      await screen.findByRole("heading", { level: 1 })
    ).toBeInTheDocument();
    expect(screen.queryAllByRole("img")).toHaveLength(3);
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);

    if (!nock.isDone()) {
      nock.cleanAll();
      throw Error("fetch endpoint not reached");
    }
  });
});
