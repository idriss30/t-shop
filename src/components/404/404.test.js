import { render, screen } from "@testing-library/react";
import Render404 from "./404";

test("can render 404 components", () => {
  render(<Render404 />);
  expect(
    screen.getByText(/nothing to see here, please navigate away/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      /Some pages were left empty because this is not a commercial shop/i
    )
  ).toBeInTheDocument();
  expect(
    screen.getByText(/feel free to test other features/i)
  ).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "404" })).toBeInTheDocument();
});
