import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer/Footer";
import { NavBar } from "./Navbar/NavBar";
import { SideDrawer } from "./SideNav/SideDrawer/SideDrawer";
import { BackDrop } from "./SideNav/BackDrop/BackDrop";
import { CosmicCanvas } from "../CosmicBackground/CosmicCanvas";

interface LayoutProps {
  isOpen?: boolean;
  openHandler?: () => void;
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  isOpen = false,
  openHandler = () => {},
  children,
}) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  if (isHome) {
    return (
      <div className="relative h-screen h-[100dvh] w-full bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Fondo cósmico aislado en GPU */}
        <CosmicCanvas />

        {/* Contenedor Fullscreen sin scrollbars innecesarias */}
        <main className="relative z-10 w-full h-full overflow-hidden">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Fondo cósmico vivo y aislado en GPU */}
      <CosmicCanvas />

      {/* Consola de Navegación HUD */}
      <NavBar isOpen={isOpen} openHandler={openHandler} />

      {/* Navegación Móvil */}
      <SideDrawer isOpen={isOpen} openHandler={openHandler} />
      <BackDrop isOpen={isOpen} openHandler={openHandler} />

      {/* Contenedor Principal para vistas interiores */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {children}
      </main>

      {/* Pie de Consola */}
      <Footer />
    </div>
  );
};
