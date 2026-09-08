import React from 'react';
import { BiPlanet, BiCodeAlt, BiServer, BiCheckShield, BiLinkExternal } from 'react-icons/bi';

export const About: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 flex flex-col space-y-10">
      <header className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <BiPlanet className="w-4 h-4" />
          <span>Acerca del Proyecto</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          NASA Astronomy Picture of the Day
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Explorador web moderno diseñado para consultar el archivo astronómico público más popular de la NASA, preservado desde 1995.
        </p>
      </header>

      {/* Qué es APOD */}
      <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-md space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>¿Qué es APOD?</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          El servicio <strong className="text-white font-semibold">Astronomy Picture of the Day (APOD)</strong> es una iniciativa conjunta de la NASA y la Universidad Tecnológica de Michigan (MTU). Cada día presenta una imagen o video diferente del universo, acompañada de una breve explicación escrita por un astrónomo profesional.
        </p>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Es uno de los sitios gubernamentales más visitados del mundo, documentando desde nebulosas distantes y colisiones galácticas hasta eclipses lunares y expediciones marcianas.
        </p>
      </section>

      {/* Arquitectura y Tecnologías */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">Arquitectura & Estándares Técnicos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
              <BiCodeAlt className="w-5 h-5" />
              <span>Vite + React 18 + TypeScript</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Herramienta moderna de desarrollo con compilación estricta ESM, HMR instantáneo y cero sobrecarga de dependencias obsoletas.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
              <BiCheckShield className="w-5 h-5" />
              <span>Contract-First con Zod</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Validación defensiva en tiempo de ejecución de todos los payloads externos de la API de la NASA, garantizando integridad de datos.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <BiServer className="w-5 h-5" />
              <span>NASA Open APIs</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conexión directa con la API oficial REST (<code className="text-slate-300 font-mono text-[11px]">api.nasa.gov/planetary/apod</code>) con soporte para fallbacks de cuota.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
            <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm">
              <BiPlanet className="w-5 h-5" />
              <span>Core Web Vitals & Impeccable</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Imágenes progresivas con reserva de aspect ratio para 0 CLS, contraste estricto WCAG AA y diseño sin emojis ni artificios genéricos.
            </p>
          </div>
        </div>
      </section>

      {/* Enlaces Oficiales */}
      <section className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-4">
        <a
          href="https://apod.nasa.gov/apod/astropix.html"
          target="_blank"
          rel="noreferrer"
          className="min-h-[48px] px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700/80 inline-flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        >
          <span>Sitio Oficial NASA APOD</span>
          <BiLinkExternal className="w-4 h-4 text-cyan-400" />
        </a>
        <a
          href="https://api.nasa.gov"
          target="_blank"
          rel="noreferrer"
          className="min-h-[48px] px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700/80 inline-flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        >
          <span>Portal de Desarrolladores NASA</span>
          <BiLinkExternal className="w-4 h-4 text-cyan-400" />
        </a>
      </section>
    </div>
  );
};
