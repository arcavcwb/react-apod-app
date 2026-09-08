import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { NavBar } from "../NavBar";

test("Navbar should be render", () => {
  render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );
});

