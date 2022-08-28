import React from "react";
import MaterialCare from "./materialCareProgram";
import { render } from "@testing-library/react";

test("matching materialComponent snapshot", () => {
  expect(render(<MaterialCare />)).toMatchSnapshot();
});
