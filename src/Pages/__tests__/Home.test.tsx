import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Home } from "../Home";

test("Home should be render", () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
});