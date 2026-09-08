import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./Components/Layout/Layout";
import { Home } from "./Pages/Home";
import { Apod } from "./Pages/Apod";
import { Gallery } from "./Pages/Gallery";
import { About } from "./Pages/About";

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openHandler = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Layout isOpen={isOpen} openHandler={openHandler}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apod" element={<Apod />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
};

export default App;
