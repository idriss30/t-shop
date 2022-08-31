import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./footer";

test("footer snapshot", () => {
  expect(
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
  ).toMatchSnapshot();
});
