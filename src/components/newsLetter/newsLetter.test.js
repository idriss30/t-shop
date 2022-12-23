import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import NewsLetter from "./newsLetter";
import nock from "nock";

describe("testing newsLetter Component", () => {
  afterAll(() => {
    if (!nock.isDone()) {
      nock.cleanAll();
      throw Error("endpoint not reached");
    }
  });
  test("can render NewsLetterComponent", () => {
    render(<NewsLetter />);
    const input = screen.getByPlaceholderText("enter your email");
    expect(screen.getByText("Join our newsLetter")).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(screen.getByRole("button", "submit")).toBeInTheDocument();
  });

  test("should save input check", () => {
    render(<NewsLetter />);
    const input = screen.getByPlaceholderText("enter your email");
    fireEvent.change(input, { target: { value: "hello@test.com" } });
    expect(input.value).toEqual("hello@test.com");
  });

  test("can submit post request", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/api/news/email")
      .reply(201, { message: "email was saved" });
    render(<NewsLetter />);
    const input = screen.getByPlaceholderText("enter your email");
    fireEvent.change(input, { target: { value: "junior3@email.com" } });
    const button = screen.getByRole("button", "submit");
    fireEvent.click(button);

    expect(
      await screen.findByText("welcome to the t-shop club")
    ).toBeInTheDocument();
  });

  test("can handle error from the server", async () => {
    nock(`${process.env.REACT_APP_URL}`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/api/news/email")
      .reply(400);

    render(<NewsLetter />);
    const input = screen.getByPlaceholderText("enter your email");
    fireEvent.change(input, { target: { value: "junior3@email.com" } });
    const button = screen.getByRole("button", "submit");
    fireEvent.click(button);
    expect(await screen.findByText("error adding email")).toBeInTheDocument();
  });
});
