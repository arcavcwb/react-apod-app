import React from "react";
import { BiMenu, BiX } from "react-icons/bi";

export const ToogleButton = ({ isOpen, openHandler, className = "" }) => {
  return (
    <button
      type="button"
      onClick={openHandler}
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={isOpen}
      className={`min-w-[48px] min-h-[48px] w-12 h-12 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/70 text-slate-200 hover:text-cyan-300 hover:bg-slate-800/80 hover:border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer ${className}`}
    >
      {isOpen ? (
        <BiX className="w-7 h-7" aria-hidden="true" />
      ) : (
        <BiMenu className="w-7 h-7" aria-hidden="true" />
      )}
    </button>
  );
};

