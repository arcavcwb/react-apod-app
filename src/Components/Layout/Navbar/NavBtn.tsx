import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { navigateWithViewTransition } from "../../../utils/navigation";

interface NavBtnProps {
  children: React.ReactNode;
  path: string;
  onClick?: () => void;
  className?: string;
}

export const NavBtn: React.FC<NavBtnProps> = ({ children, path, onClick, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Si se presiona con tecla modificadora (cmd/ctrl para nueva pestaña), permitir comportamiento por defecto
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    if (onClick) {
      onClick();
    }

    // Interceptar con View Transitions si está soportado
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      typeof (document as any).startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      e.preventDefault();
      navigateWithViewTransition(navigate, path);
    }
  };

  return (
    <NavLink
      to={path}
      onClick={handleClick}
      className={({ isActive }) =>
        `relative inline-flex items-center justify-center min-h-[48px] px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
          isActive
            ? "text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 shadow-glow-cyan font-bold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-cyan-400 after:shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            : "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 font-medium"
        } ${className}`
      }
    >
      <span className="relative z-10">{children}</span>
    </NavLink>
  );
};
