import React from "react";
import Footer from "./Footer/Footer";
import { NavBar } from "./Navbar/NavBar";
import { SideDrawer } from "./SideNav/SideDrawer/SideDrawer";
import { BackDrop } from "./SideNav/BackDrop/BackDrop";

export const Layout = ({ isOpen, openHandler, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
      <NavBar isOpen={isOpen} openHandler={openHandler} />
      <SideDrawer isOpen={isOpen} openHandler={openHandler} />
      <BackDrop isOpen={isOpen} openHandler={openHandler} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

