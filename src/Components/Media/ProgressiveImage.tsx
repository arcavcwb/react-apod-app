import React, { useState } from 'react';
import { BiImageAlt, BiRefresh } from 'react-icons/bi';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  aspectRatio = 'aspect-video',
  priority = false,
  className = '',
  onClick,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-slate-900 rounded-xl border border-slate-800/80 ${aspectRatio} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Skeleton de Carga Anti-Shift */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-900/90 animate-pulse motion-reduce:animate-none flex flex-col items-center justify-center text-slate-500">
          <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-cyan-400 animate-spin mb-2" />
          <span className="text-xs text-slate-400 font-mono">Cargando medio...</span>
        </div>
      )}

      {/* Estado Defensivo de Error con Reintento */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 text-slate-400 border border-slate-800 rounded-xl">
          <BiImageAlt className="w-10 h-10 text-slate-500 mb-2" />
          <p className="text-sm font-semibold text-slate-200">No se pudo cargar la imagen astronómica</p>
          <p className="text-xs text-slate-500 mt-1">El servidor de medios de la NASA puede estar ocupado.</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setError(false);
              setLoaded(false);
            }}
            className="mt-4 px-4 py-2 min-h-[48px] rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 inline-flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          >
            <BiRefresh className="w-4 h-4" />
            <span>Reintentar carga</span>
          </button>
        </div>
      )}

      {/* Imagen Optimizada */}
      {!error && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
