import React from "react";
import Footer from "./Footer/Footer";
import { NavBar } from "./Navbar/NavBar";
import { SideDrawer } from "./SideNav/SideDrawer/SideDrawer";
import { BackDrop } from "./SideNav/BackDrop/BackDrop";
import apodBackground from "../../Assets/apodBackground.png";

interface LayoutProps {
  isOpen: boolean;
  openHandler: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ isOpen, openHandler, children }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Capa de fondo cósmico aislada en GPU (Zero Scroll Repaint) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none -z-10 bg-cover bg-center bg-no-repeat opacity-35 will-change-transform"
        style={{ backgroundImage: `url(${apodBackground})` }}
      />
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
