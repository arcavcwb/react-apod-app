import React from "react";
import { ToogleButton } from "./ToogleButton";
import { NavBtn } from "../../Navbar/NavBtn";
import nasa from "../../../../Assets/nasa.png";

interface SideDrawerProps {
  isOpen: boolean;
  openHandler: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, openHandler }) => {
  return (
    <aside
      aria-label="Consola de navegación móvil"
      aria-hidden={!isOpen}
      className={`fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-slate-950/95 backdrop-blur-2xl border-l border-cyan-500/20 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <img className="w-9 h-auto drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]" src={nasa} alt="NASA insignia" />
          <div className="flex flex-col">
            <span className="font-bold text-base text-white tracking-wide font-mono">NASA APOD</span>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Consola Móvil</span>
          </div>
        </div>
        <ToogleButton isOpen={isOpen} openHandler={openHandler} />
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="flex flex-col space-y-3">
          <li>
            <NavBtn path="/" onClick={openHandler} className="w-full justify-start text-sm">
              Inicio
            </NavBtn>
          </li>
          <li>
            <NavBtn path="/apod" onClick={openHandler} className="w-full justify-start text-sm">
              A.P.O.D
            </NavBtn>
          </li>
          <li>
            <NavBtn path="/gallery" onClick={openHandler} className="w-full justify-start text-sm">
              Galería
            </NavBtn>
          </li>
          <li>
            <NavBtn path="/about" onClick={openHandler} className="w-full justify-start text-sm">
              Acerca de
            </NavBtn>
          </li>
        </ul>
      </nav>

      <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 font-mono text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span className="uppercase text-[11px] text-cyan-300">NODO ORBITAL CONECTADO</span>
        </div>
      </div>
    </aside>
  );
};
