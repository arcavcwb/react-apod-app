import React from "react";
import { NavLink } from "react-router-dom";

export const NavBtn = ({ children, path, onClick, className = "" }) => {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `inline-flex items-center justify-center min-h-[48px] px-5 py-2.5 rounded-lg text-sm tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
          isActive
            ? "text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-semibold"
            : "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent font-medium"
        } ${className}`
      }
    >
      {children}
    </NavLink>
  );
};

