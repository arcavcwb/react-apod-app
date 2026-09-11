import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ToogleButton } from "../SideNav/SideDrawer/ToogleButton";
import { NavBtn } from "./NavBtn";
import nasa from "../../../Assets/nasa.png";

interface NavBarProps {
  isOpen: boolean;
  openHandler: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ isOpen, openHandler }) => {
  const [utcTime, setUtcTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");
      setUtcTime(`${hours}:${minutes}:${seconds} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors duration-200">
      {/* Barra de Telemetría Superior HUD */}
      <div className="hidden lg:flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 border-b border-slate-800/60 text-[10px] font-mono text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wider">OBSERVATORY NODE // ONLINE</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500 tracking-wider">APOD OPTICAL PIPELINE: NOMINAL</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-slate-400 font-mono tracking-widest">{utcTime || "CALIBRATING..."}</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-500/80">LATENCY &lt; 15MS</span>
        </div>
      </div>

      <nav
        aria-label="Navegación principal de consola"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-2 flex items-center justify-between"
      >
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <NavLink
            to="/"
            className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-lg p-1"
          >
            <div className="relative">
              <img
                src={nasa}
                alt="NASA Logo"
                className="w-11 h-11 object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full border border-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-wider text-white group-hover:text-cyan-300 transition-colors flex items-center space-x-1.5">
                <span>NASA APOD</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                  v2.0
                </span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline tracking-wider">
                DEEP-SPACE OBSERVATORY
              </span>
            </div>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-1 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800/80 backdrop-blur-md">
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
