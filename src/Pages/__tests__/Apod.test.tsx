import { render, screen } from "@testing-library/react";
import { Apod } from "../Apod";

test("Apod sholud be render", () => {
  render(<Apod />);
});
