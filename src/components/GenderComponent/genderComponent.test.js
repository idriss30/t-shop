import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Gender from "./genderComponent";
import nock from "nock";

beforeEach(() => {
  localStorage.clear();
});

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
    category: "woman",
    bestSeller: false,
    name: "VENTED COTTON T-SHIRT",
    description:
      "T-shirt made of 100% cotton. Round neck and short sleeves. Side vents at hem.",
    price: 32,
    imageName: "ventedBlue",
  },
];
test("can render the man gender using fetch method", async () => {
  nock("http://localhost:5000/")
    .defaultReplyHeaders({
      "access-control-allow-origin": "*",
      "access-control-allow-credentials": "true",
    })
    .get("/api/shop/products")
    .reply(200, {
      products: items,
    });
  const route = "/man";
  render(
    <MemoryRouter initialEntries={[route]}>
      <Gender />
    </MemoryRouter>
  );

  expect(await screen.findByText("T-SHIRTS FOR MEN")).toBeInTheDocument();
  expect(screen.getByAltText(`ZIP MOCK NECK T-SHIRT`)).toBeInTheDocument();
  expect(screen.getAllByRole("img")).toHaveLength(2);
});

test("can render man component using the localStorage api", () => {
  localStorage.setItem("products", JSON.stringify(items));
  const route = "/man";
  render(
    <MemoryRouter initialEntries={[route]}>
      <Gender />
    </MemoryRouter>
  );
  expect(screen.getByText("T-SHIRTS FOR MEN")).toBeInTheDocument();
  expect(screen.getByAltText(`ZIP MOCK NECK T-SHIRT`)).toBeInTheDocument();
  expect(screen.getAllByRole("img")).toHaveLength(2);
});

test("can render woman gender using localStorage methods", () => {
  localStorage.setItem("products", JSON.stringify(items));
  const route = "/woman";
  render(
    <MemoryRouter initialEntries={[route]}>
      <Gender />
    </MemoryRouter>
  );

  expect(screen.getByText("T-SHIRTS FOR WOMEN")).toBeInTheDocument();
});

test("can fetch products using the fetch methods", async () => {
  nock("http://localhost:5000/")
    .defaultReplyHeaders({
      "access-control-allow-origin": "*",
      "access-control-allow-credentials": "true",
    })
    .get("/api/shop/products")
    .reply(200, {
      products: items,
    });

  const route = "/woman";
  render(
    <MemoryRouter initialEntries={[route]}>
      <Gender />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByAltText(`VENTED COTTON T-SHIRT`)).toBeInTheDocument();
  });

  expect(screen.getAllByRole("img")).toHaveLength(2);
  expect(screen.getByText("T-SHIRTS FOR WOMEN")).toBeInTheDocument();
});
