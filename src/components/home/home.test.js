import React from "react";
import { screen, render } from "@testing-library/react";
import Home from "./home";
import { MemoryRouter } from "react-router-dom";
import nock from "nock";

describe("testing home components features", () => {
  const products = [
    {
      id: 11,
      category: "man",
      bestSeller: true,
      name: "Graphic PRINT T-SHIRT",
      description:
        "Round neck T-shirt with short sleeves. Contrasting graphic prints at front and back.",
      price: 40,
      imageName: "taupe",
    },
    {
      id: 12,
      category: "man",
      bestSeller: false,
      name: "Graphic PRINT T-SHIRT",
      description:
        "Round neck T-shirt with short sleeves. Front contrast prints of embroidery.",
      price: 40,
      imageName: "black2",
    },
    {
      id: 13,
      category: "woman",
      bestSeller: true,
      name: "VENTED COTTON T-SHIRT",
      description:
        "T-shirt made of 100% cotton. Round neck and short sleeves. Side vents at hem.",
      price: 32,
      imageName: "ventedBlack",
    },
    {
      id: 14,
      category: "woman",
      bestSeller: false,
      name: "VENTED COTTON T-SHIRT",
      description:
        "T-shirt made of 100% cotton. Round neck and short sleeves. Side vents at hem.",
      price: 32,
      imageName: "ventedBlue",
    },
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  test("products are rendered fom localStorage", () => {
    localStorage.setItem("products", JSON.stringify(products));
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getAllByRole("img")).toHaveLength(5); // includes material care image;
    expect(screen.getAllByRole("heading")).toHaveLength(6);
    expect(screen.getByText("Content & Care")).toBeInTheDocument();
    expect(screen.getByText("Join our newsLetter")).toBeInTheDocument();
    expect(screen.getByText("Our Collection")).toBeInTheDocument();
    expect(screen.getByRole("button", "Submit")).toBeInTheDocument();
  });

  test("products are fetched from the server", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/api/shop/products")
      .reply(200, { products });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(await screen.findAllByRole("img")).toHaveLength(5);
    expect(screen.getAllByRole("heading")).toHaveLength(6);
    expect(screen.getByText("Content & Care")).toBeInTheDocument();
    expect(screen.getByText("Join our newsLetter")).toBeInTheDocument();
    expect(screen.getByText("Our Collection")).toBeInTheDocument();
    expect(screen.getByRole("button", "Submit")).toBeInTheDocument();

    if (!nock.isDone()) {
      nock.cleanAll();
      throw Error("product endpoint was not reached");
    }
  });
});
