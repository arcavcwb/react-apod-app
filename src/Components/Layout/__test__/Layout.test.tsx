import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Layout } from "../Layout";

test("Layout should be render", () => {
  render(
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
});

