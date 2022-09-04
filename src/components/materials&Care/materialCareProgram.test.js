import React from "react";
import MaterialCare from "./materialCareProgram";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

test("matching materialComponent snapshot", () => {
  expect(
    render(
      <MemoryRouter>
        <MaterialCare />
      </MemoryRouter>
    )
  ).toMatchSnapshot();
});
