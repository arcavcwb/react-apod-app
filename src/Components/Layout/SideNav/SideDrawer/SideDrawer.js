import React from "react";
import { ToogleButton } from "./ToogleButton";
import { NavBtn } from "../../Navbar/NavBtn";
import nasa from "../../../../Assets/nasa.png";

export const SideDrawer = ({ isOpen, openHandler }) => {
  return (
    <aside
      aria-label="Navegación móvil"
      aria-hidden={!isOpen}
      className={`fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800/80 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <img className="w-9 h-auto drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]" src={nasa} alt="NASA insignia" />
          <div className="flex flex-col">
            <span className="font-bold text-base text-white tracking-wide">NASA APOD</span>
            <span className="text-xs text-slate-400">Observatorio</span>
          </div>
        </div>
        <ToogleButton isOpen={isOpen} openHandler={openHandler} />
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="flex flex-col space-y-3">
          <li>
            <NavBtn path="/" onClick={openHandler} className="w-full justify-start text-base">
              Inicio
            </NavBtn>
          </li>
          <li>
            <NavBtn path="/apod" onClick={openHandler} className="w-full justify-start text-base">
              A.P.O.D
            </NavBtn>
          </li>
          <li>
            <NavBtn path="/gallery" onClick={openHandler} className="w-full justify-start text-base">
              Galería
            </NavBtn>
          </li>
          <li>
            <NavBtn path="/about" onClick={openHandler} className="w-full justify-start text-base">
              Acerca de
            </NavBtn>
          </li>
        </ul>
      </nav>

      <div className="p-5 border-t border-slate-800/80 bg-slate-900/30">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>NASA Open API v1</span>
        </div>
      </div>
    </aside>
  );
};

