import React from "react";
import { NavLink } from "react-router-dom";
import { ToogleButton } from "../SideNav/SideDrawer/ToogleButton";
import { NavBtn } from "./NavBtn";
import nasa from "../../../Assets/nasa.png";

interface NavBarProps {
  isOpen: boolean;
  openHandler: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ isOpen, openHandler }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-colors duration-200">
      <nav
        aria-label="Navegación principal"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between"
      >
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <NavLink
            to="/"
            className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-lg p-1"
          >
            <img
              src={nasa}
              alt="NASA Logo"
              className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                NASA APOD
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Astronomy Picture of the Day
              </span>
            </div>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-2">
          <NavBtn path="/">Inicio</NavBtn>
          <NavBtn path="/apod">A.P.O.D</NavBtn>
          <NavBtn path="/gallery">Galería</NavBtn>
          <NavBtn path="/about">Acerca de</NavBtn>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <ToogleButton isOpen={isOpen} openHandler={openHandler} />
        </div>
      </nav>
    </header>
  );
};
