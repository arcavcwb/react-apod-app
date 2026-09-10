import React, { useState, useEffect, useCallback } from 'react';
import { fetchRandomApods, getMediaThumbnail } from '../services/nasa.service';
import { ApodItem } from '../contracts/apod.contract';
import { ProgressiveImage } from '../Components/Media/ProgressiveImage';
import { Spinner } from '../Components/Spinner/Spinner';
import {
  BiImages,
  BiRefresh,
  BiCalendar,
  BiX,
  BiFullscreen,
  BiCopyright,
  BiInfoCircle,
  BiPlayCircle,
  BiShieldQuarter,
} from 'react-icons/bi';

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<ApodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ApodItem | null>(null);

  const loadGallery = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    const res = await fetchRandomApods(12, forceRefresh);
    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      // Filtrar items con URL válida
      setItems(res.data.filter((it) => !!it.url));
      setIsFallback(!!res.isFallback);
    }
    setLoading(false);
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    const res = await fetchRandomApods(6);
    if (res.data) {
      const newItems = res.data.filter((it) => !!it.url);
      setItems((prev) => [...prev, ...newItems]);
    }
    setLoadingMore(false);
  };

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 flex flex-col space-y-8">
      {/* Encabezado de la Galería */}
      <header className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <BiImages className="w-4 h-4" />
          <span>Muestrario Astronómico Dinámico</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Galería del Universo
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Selección de observaciones y astrofotografías de la NASA. Selecciona cualquier tarjeta para inspeccionar su ficha técnica en alta resolución.
        </p>
      </header>

      {/* Banner de Resiliencia / Modo Respaldo */}
      {isFallback && !loading && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-amber-200 flex items-center space-x-3 text-xs sm:text-sm">
          <BiShieldQuarter className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p>
            <strong className="font-semibold text-amber-300">Modo Respaldo Activo:</strong> Debido a la alta demanda en la API de NASA, se presenta una selección curada del archivo cósmico con disponibilidad garantizada.
          </p>
        </div>
      )}

      {/* Estado de Carga Inicial */}
      <Spinner loading={loading} />

      {/* Estado de Error */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-6 text-center flex flex-col items-center space-y-4">
          <BiInfoCircle className="w-8 h-8 text-red-400" />
          <p className="text-sm text-slate-300 max-w-md">{error}</p>
          <button
            type="button"
            onClick={() => loadGallery(true)}
            className="min-h-[48px] px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 inline-flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
          >
            <BiRefresh className="w-4 h-4" />
            <span>Reintentar carga</span>
          </button>
        </div>
      )}

      {/* Cuadrícula de Galería */}
      {!loading && items.length > 0 && (
        <section aria-label="Cuadrícula de fotografías espaciales" className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => {
              const thumbnailUrl = getMediaThumbnail(item);
              const isVideo = item.media_type === 'video';

              return (
                <article
                  key={`${item.date}-${idx}`}
                  onClick={() => setSelectedItem(item)}
                  className="group rounded-2xl border border-slate-800/80 bg-slate-900/90 overflow-hidden transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] cursor-pointer flex flex-col"
                >
                  <div className="relative overflow-hidden">
                    <ProgressiveImage
                      src={thumbnailUrl}
                      alt={item.title}
                      aspectRatio="aspect-square"
                      priority={false}
                      fallbackSrc={item.hdurl || undefined}
                      className="group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Indicador de Video Embebido */}
                    {isVideo && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-slate-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-lg group-hover:scale-110 transition-transform">
                          <BiPlayCircle className="w-8 h-8" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center space-x-1 text-xs font-mono text-cyan-400">
                          <BiCalendar className="w-3.5 h-3.5" />
                          <span>{item.date}</span>
                        </span>
                        {isVideo && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 uppercase tracking-wider">
                            Video
                          </span>
                        )}
                      </div>
                      <h2 className="text-base font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h2>
                    </div>
                    <span className="text-xs text-slate-400 font-medium inline-flex items-center space-x-1">
                      <span>Ver detalles</span>
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Botón de Cargar Más */}
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="min-h-[48px] px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-semibold text-sm inline-flex items-center space-x-2 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 cursor-pointer"
            >
              <BiRefresh className={`w-5 h-5 text-cyan-400 ${loadingMore ? 'animate-spin' : ''}`} />
              <span>{loadingMore ? 'Cargando más fotos...' : 'Cargar Más Fotografías'}</span>
            </button>
          </div>
        </section>
      )}

      {/* Modal de Detalle de Imagen / Video */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setSelectedItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/95 p-6 sm:p-8 space-y-6 shadow-2xl relative"
          >
            {/* Header del Modal */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-2">
                  <BiCalendar className="w-3.5 h-3.5" />
                  <span>{selectedItem.date}</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {selectedItem.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Cerrar ventana de detalle"
                className="min-w-[48px] min-h-[48px] w-12 h-12 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
              >
                <BiX className="w-6 h-6" />
              </button>
            </div>

            {/* Visualizador de Medios en Modal: Imagen o Video */}
            <div className="overflow-hidden rounded-xl">
              {selectedItem.media_type === 'video' ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                  <iframe
                    src={selectedItem.url}
                    title={selectedItem.title}
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <ProgressiveImage
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  aspectRatio="aspect-video"
                  priority={true}
                  fallbackSrc={selectedItem.hdurl || undefined}
                />
              )}
            </div>

            {/* Información y Enlaces HD */}
            <div className="space-y-4">
              {selectedItem.copyright && (
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <BiCopyright className="w-4 h-4 text-slate-500" />
                  <span>Crédito fotográfico: {selectedItem.copyright.trim()}</span>
                </div>
              )}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {selectedItem.explanation}
              </p>

              {selectedItem.hdurl && (
                <div className="pt-2">
                  <a
                    href={selectedItem.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold text-xs inline-flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
                  >
                    <BiFullscreen className="w-4 h-4" />
                    <span>Ver Imagen Original en Ultra HD</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
