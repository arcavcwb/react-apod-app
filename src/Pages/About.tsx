import React from 'react';
import { BiPlanet, BiCodeAlt, BiServer, BiCheckShield, BiLinkExternal, BiRadar } from 'react-icons/bi';

export const About: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col space-y-10">
      <header className="space-y-4 text-left">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold tracking-wider shadow-glow-cyan backdrop-blur-md">
          <BiRadar className="w-4 h-4 text-cyan-400" />
          <span>DOSSIER DE LA MISIÓN // ESPECIFICACIÓN TÉCNICA</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
          NASA APOD Explorer
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
          Consola interactiva de exploración científica diseñada para conectar a la humanidad con el archivo astronómico de la NASA preservado desde el 16 de junio de 1995.
        </p>
      </header>

      {/* Qué es APOD */}
      <section
        aria-label="Información sobre la misión APOD"
        className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4 shadow-hud-panel hud-corner-brackets"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>¿Qué es la iniciativa APOD?</span>
          </h2>
          <span className="text-[10px] font-mono text-cyan-400">NASA &bull; MTU PARTNERSHIP</span>
        </div>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          El servicio <strong className="text-white font-semibold">Astronomy Picture of the Day (APOD)</strong> es una iniciativa conjunta entre la NASA y la Universidad Tecnológica de Michigan (MTU). Cada ciclo solar presenta una imagen o transmisión de video diferente del cosmos, acompañada de una memoria técnica redactada por un astrofísico profesional.
        </p>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
          Representa uno de los archivos abiertos de divulgación espacial más consultados del planeta, documentando nebulosas galácticas, supernovas distantes y expediciones de telescopios espaciales como Hubble, James Webb y Chandra.
        </p>
      </section>

      {/* Arquitectura y Tecnologías */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span>Arquitectura y Estándares de Rendimiento</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-2 hover:border-cyan-500/40 transition-colors hud-corner-brackets">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold text-xs uppercase">
              <BiCodeAlt className="w-4 h-4" />
              <span>Vite 8 + React 18 + TS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Arquitectura ESM pura con compilación estática en 1.02 segundos, renderizado a 60–120 FPS sin jank de scroll y cero sobrecarga de dependencias obsoletas.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-2 hover:border-indigo-500/40 transition-colors hud-corner-brackets">
            <div className="flex items-center space-x-2 text-indigo-400 font-mono font-bold text-xs uppercase">
              <BiCheckShield className="w-4 h-4" />
              <span>Contract-First con Zod</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Inferencia y validación en tiempo de ejecución de payloads externos con sanitización estricta de protocolos HTTPS y manejo defensivo de campos nulos.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-2 hover:border-emerald-500/40 transition-colors hud-corner-brackets">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-xs uppercase">
              <BiServer className="w-4 h-4" />
              <span>Circuit Breaker & Fallback</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Patrón de resiliencia que detecta límites HTTP 429 de la NASA respondiendo en 0ms con un catálogo astronómico curado offline sin bloquear la interfaz.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-2 hover:border-sky-500/40 transition-colors hud-corner-brackets">
            <div className="flex items-center space-x-2 text-sky-400 font-mono font-bold text-xs uppercase">
              <BiPlanet className="w-4 h-4" />
              <span>Native View Transitions API</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Transiciones cinemáticas fluidas entre cuadrantes y el visor principal mediante morphing nativo de imagen asistido por GPU.
            </p>
          </div>
        </div>
      </section>

      {/* Enlaces de Transmisión Externa */}
      <section className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-4">
        <a
          href="https://apod.nasa.gov/apod/astropix.html"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[48px] px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-mono font-semibold text-slate-200 hover:text-white border border-slate-700/80 hover:border-cyan-500/40 inline-flex items-center space-x-2 transition-all shadow-hud-panel focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer active:scale-95"
        >
          <span>Sitio Oficial NASA APOD</span>
          <BiLinkExternal className="w-4 h-4 text-cyan-400" />
        </a>
        <a
          href="https://api.nasa.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[48px] px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-mono font-semibold text-slate-200 hover:text-white border border-slate-700/80 hover:border-cyan-500/40 inline-flex items-center space-x-2 transition-all shadow-hud-panel focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer active:scale-95"
        >
          <span>Portal de APIs Abiertas NASA</span>
          <BiLinkExternal className="w-4 h-4 text-cyan-400" />
        </a>
      </section>
    </div>
  );
};
