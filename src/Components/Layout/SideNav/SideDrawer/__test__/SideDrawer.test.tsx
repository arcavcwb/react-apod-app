import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { SideDrawer } from "../SideDrawer";
import { ToogleButton } from "../ToogleButton";

test("SideDrawer should be render", () => {
  render(
    <BrowserRouter>
      <SideDrawer />
    </BrowserRouter>
  );
});

test("ToogleButton should be render", () => {
  render(<ToogleButton />);
});

