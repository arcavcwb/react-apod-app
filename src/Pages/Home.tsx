import React from 'react';
import { Orbital3DSystem } from '../Components/OrbitalSystem/Orbital3DSystem';

export const Home: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-8 px-2 sm:px-4 flex flex-col items-center">
      {/* Cockpit Header */}
      <header className="text-center max-w-3xl mb-4 sm:mb-6 relative w-full">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
          Explora la Frontera del{' '}
          <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            Cosmos
          </span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-normal">
          Consola orbital de exploración científica interactiva. Selecciona los nodos celestes en órbita para ingresar a los subsistemas del observatorio.
        </p>
      </header>

      {/* Cockpit 3D WebGL Interactivo */}
      <main className="w-full flex flex-col items-center justify-center">
        <Orbital3DSystem />
      </main>
    </div>
  );
};
