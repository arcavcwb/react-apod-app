import React, { useState, useEffect } from 'react';
import { BiImageAlt, BiRefresh } from 'react-icons/bi';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  priority?: boolean;
  className?: string;
  fallbackSrc?: string;
  optimizedWidth?: number;
  onClick?: () => void;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  aspectRatio = 'aspect-video',
  priority = false,
  className = '',
  fallbackSrc,
  optimizedWidth,
  onClick,
}) => {
  const targetWidth = optimizedWidth || (priority ? 1200 : 600);
  const initialSrc = getOptimizedImageUrl(src, { width: targetWidth });

  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Sincronizar estado cuando la prop src cambie
  useEffect(() => {
    const optimized = getOptimizedImageUrl(src, { width: targetWidth });
    setCurrentSrc(optimized);
    setLoaded(false);
    setError(false);
    setRetryCount(0);
  }, [src, targetWidth]);

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(false);
    setLoaded(false);
    if (retryCount >= 1 && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setRetryCount((prev) => prev + 1);
      setCurrentSrc(`${src}${src.includes('?') ? '&' : '?'}retry=${Date.now()}`);
    }
  };

  const handleImageError = () => {
    // Si la versión optimizada por CDN falla, degradar transparentemente a la URL original
    if (currentSrc !== src) {
      setCurrentSrc(src);
    } else if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setError(true);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-slate-900 rounded-xl border border-slate-800/80 ${aspectRatio} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Skeleton de Carga Progresiva Anti-Shift */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-900/90 animate-pulse motion-reduce:animate-none flex flex-col items-center justify-center text-slate-500 z-10">
          <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-cyan-400 animate-spin mb-2" />
          <span className="text-xs text-slate-400 font-mono">Cargando medio astronómico...</span>
        </div>
      )}

      {/* Estado Defensivo de Error con Recuperación */}
      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 text-slate-400 border border-slate-800 rounded-xl">
          <BiImageAlt className="w-10 h-10 text-slate-500 mb-2" />
          <p className="text-sm font-semibold text-slate-200">No se pudo cargar la imagen astronómica</p>
          <p className="text-xs text-slate-500 mt-1">El servidor de medios de la NASA puede estar ocupado o en mantenimiento.</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 px-4 py-2 min-h-[48px] rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 inline-flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
          >
            <BiRefresh className="w-4 h-4" />
            <span>Reintentar carga</span>
          </button>
        </div>
      )}

      {/* Imagen Optimizada */}
      {!error && (
        <img
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...({ fetchpriority: priority ? 'high' : 'auto' } as Record<string, string>)}
          onLoad={() => setLoaded(true)}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
