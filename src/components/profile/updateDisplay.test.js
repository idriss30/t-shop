import {
  screen,
  fireEvent,
  render,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import UpdateProfileForm from "./updateDisplay";
import nock from "nock";
import { BrowserRouter } from "react-router-dom";

beforeAll(() => {
  window.scrollTo = jest.fn();
});

afterEach(() => {
  if (!nock.isDone()) {
    nock.cleanAll();
    throw Error("some endpoints not reached");
  }
});
const getUsername = () => {
  const cookies = document.cookie;
  const cookiesArr = cookies.split("=");
  return cookiesArr[1]; // only one cookie is accessible
};
document.cookie = `user=test; max-age=3600; path=/`;

test("can render profileUdate form", () => {
  render(
    <BrowserRouter>
      <UpdateProfileForm />
    </BrowserRouter>
  );

  expect(
    screen.getByText(/please update your information/i)
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /go back/i })).toBeInTheDocument();
  expect(screen.getAllByRole("textbox")).toHaveLength(5);
  expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /update now/i })
  ).toBeInTheDocument();
});

test("can redirect to profile on  link click", () => {
  render(
    <BrowserRouter>
      <UpdateProfileForm />
    </BrowserRouter>
  );

  const goBackButton = screen.getByRole("link", { name: /go back/i });
  fireEvent.click(goBackButton);

  expect(window.document.location.pathname).toBe("/users/profile");
});

test("can update profile without error", async () => {
  const username = getUsername();
  nock(`${process.env.REACT_APP_URL}`)
    .defaultReplyHeaders({
      "access-control-allow-origin": "*",
      "access-control-allow-credentials": "true",
    })
    .intercept(`/api/users/update/${username}`, "OPTIONS")
    .reply(200, null, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application:json",
    })
    .put(`/api/users/update/${username}`)
    .reply(200, { message: "success" });

  render(
    <BrowserRouter>
      <UpdateProfileForm />
    </BrowserRouter>
  );

  const email = screen.getByPlaceholderText(/email/i);
  const password = screen.getByPlaceholderText("password");
  const address = screen.getByPlaceholderText("address");
  const city = screen.getByPlaceholderText("city");
  const state = screen.getByPlaceholderText("state");
  const zipCode = screen.getByPlaceholderText(/zip code/i);
  const submitButton = screen.getByRole("button", { name: /Update now/i });

  fireEvent.change(email, { target: { value: "email@email.com" } });
  fireEvent.change(password, { target: { value: "123password" } });
  fireEvent.change(address, { target: { value: "123 dalton st" } });
  fireEvent.change(city, { target: { value: "boston" } });
  fireEvent.change(state, { target: { value: "ma" } });
  fireEvent.change(zipCode, { target: { value: "12345" } });

  fireEvent.click(submitButton);
  expect(
    await screen.findByText(/your account has been updated/i)
  ).toBeInTheDocument();

  await waitForElementToBeRemoved(() =>
    screen.queryByText(/your account has been updated/i)
  );
});

test("can handle profile update error", async () => {
  const username = getUsername();
  nock(`${process.env.REACT_APP_URL}`)
    .defaultReplyHeaders({
      "access-control-allow-origin": "*",
      "access-control-allow-credentials": "true",
    })
    .intercept(`/api/users/update/${username}`, "OPTIONS")
    .reply(200, null, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application:json",
    })
    .put(`/api/users/update/${username}`)
    .reply(400);

  render(
    <BrowserRouter>
      <UpdateProfileForm />
    </BrowserRouter>
  );

  const email = screen.getByPlaceholderText(/email/i);
  const password = screen.getByPlaceholderText("password");
  const address = screen.getByPlaceholderText("address");
  const city = screen.getByPlaceholderText("city");
  const state = screen.getByPlaceholderText("state");
  const zipCode = screen.getByPlaceholderText(/zip code/i);
  const submitButton = screen.getByRole("button", { name: /Update now/i });

  fireEvent.change(email, { target: { value: "email@email.com" } });
  fireEvent.change(password, { target: { value: "123password" } });
  fireEvent.change(address, { target: { value: "123 dalton st" } });
  fireEvent.change(city, { target: { value: "boston" } });
  fireEvent.change(state, { target: { value: "ma" } });
  fireEvent.change(zipCode, { target: { value: "12345" } });

  fireEvent.click(submitButton);
  expect(
    await screen.findByText(/request failed with status code 400/i)
  ).toBeInTheDocument();

  await waitForElementToBeRemoved(() =>
    screen.queryByText(/request failed with status code 400/i)
  );
});
