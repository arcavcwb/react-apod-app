import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRandomApods, getMediaThumbnail } from '../services/nasa.service';
import { ApodItem } from '../contracts/apod.contract';
import { ProgressiveImage } from '../Components/Media/ProgressiveImage';
import { Spinner } from '../Components/Spinner/Spinner';
import { navigateWithViewTransition } from '../utils/navigation';
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
  BiRocket,
  BiRadar,
} from 'react-icons/bi';

export const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ApodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [inspectingItem, setInspectingItem] = useState<ApodItem | null>(null);
  const [transitioningDate, setTransitioningDate] = useState<string | null>(null);

  const loadGallery = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    const res = await fetchRandomApods(12, forceRefresh);
    if (res.error) {
      setError(res.error);
    } else if (res.data) {
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

  // Navegar a APOD con View Transition directa de la tarjeta
  const handleOpenInApod = (item: ApodItem) => {
    setTransitioningDate(item.date);
    navigateWithViewTransition(navigate, `/apod?date=${item.date}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col space-y-10">
      {/* Encabezado del Archivo Orbital */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold tracking-wider shadow-glow-cyan backdrop-blur-md">
          <BiRadar className="w-4 h-4 animate-spin text-cyan-400" style={{ animationDuration: '10s' }} />
          <span>ARCHIVO ORBITAL // COORDENADAS ALEATORIAS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
          Archivo Cósmico Profundo
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Muestrario de observaciones astrofísicas indexadas en la base de datos de la NASA. Selecciona cualquier cuadrante para transferir el medio al visor principal.
        </p>
      </header>

      {/* Banner de Respaldo */}
      {isFallback && !loading && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 text-amber-200 flex items-center space-x-3 text-xs sm:text-sm backdrop-blur-md shadow-lg">
          <BiShieldQuarter className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p>
            <strong className="font-semibold text-amber-300 font-mono">[ARCHIVO DE CONTINGENCIA]:</strong> Presentando selección curada de alta resolución ante saturación de cuota pública.
          </p>
        </div>
      )}

      {/* Estado de Carga Inicial */}
      <Spinner loading={loading} />

      {/* Estado de Error */}
      {error && !loading && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-8 text-center flex flex-col items-center space-y-4 backdrop-blur-xl">
          <BiInfoCircle className="w-10 h-10 text-rose-400" />
          <p className="text-sm text-slate-300 max-w-md">{error}</p>
          <button
            type="button"
            onClick={() => loadGallery(true)}
            className="min-h-[48px] px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono font-semibold text-cyan-300 border border-cyan-500/40 inline-flex items-center space-x-2 transition-all shadow-glow-cyan focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer active:scale-95"
          >
            <BiRefresh className="w-4 h-4" />
            <span>Reintentar Enlace</span>
          </button>
        </div>
      )}

      {/* Cuadrícula de Archivo Orbital */}
      {!loading && items.length > 0 && (
        <section aria-label="Cuadrícula de observaciones astronómicas" className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, idx) => {
              const thumbnailUrl = getMediaThumbnail(item);
              const isVideo = item.media_type === 'video';
              const sectorId = String(idx + 1).padStart(2, '0');
              const isTargetTransition = transitioningDate === item.date;

              return (
                <article
                  key={`${item.date}-${idx}`}
                  onClick={() => handleOpenInApod(item)}
                  className="group relative rounded-2xl border border-slate-800/80 bg-slate-950/70 overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-glow-cyan hover:-translate-y-1.5 cursor-pointer flex flex-col backdrop-blur-md hud-corner-brackets"
                >
                  {/* Contenedor de Imagen con View Transition Target */}
                  <div
                    style={isTargetTransition ? { viewTransitionName: 'hero-apod-image' } : undefined}
                    className="relative aspect-square overflow-hidden bg-slate-950"
                  >
                    <ProgressiveImage
                      src={thumbnailUrl}
                      alt={item.title}
                      aspectRatio="aspect-square"
                      priority={false}
                      fallbackSrc={item.hdurl || undefined}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Overlay sutil de scanlines al hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Badge de Sector Orbital */}
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-cyan-400/90 tracking-widest backdrop-blur-sm">
                        SEC-{sectorId}
                      </span>
                    </div>

                    {/* Indicador de Video */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-slate-950/80 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-glow-cyan group-hover:scale-110 transition-transform">
                          <BiPlayCircle className="w-7 h-7" />
                        </div>
                      </div>
                    )}

                    {/* Badge de Tipo en Esquina Superior Derecha */}
                    <div className="absolute top-3 right-3 pointer-events-none">
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-cyan-500/30 text-[10px] font-mono text-slate-300 uppercase">
                        {item.media_type}
                      </span>
                    </div>
                  </div>

                  {/* Cuerpo de Metadatos de la Card */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-[11px] font-mono text-cyan-400">
                        <BiCalendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                      </div>
                      <h2 className="text-sm font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h2>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-cyan-300 transition-colors">
                      <span>EXPLORAR EN VISOR</span>
                      <span aria-hidden="true">&rarr;</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Botón de Carga de Más Observaciones */}
          <div className="flex justify-center pt-6">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="min-h-[48px] px-8 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-cyan-500/30 font-mono text-xs uppercase tracking-wider inline-flex items-center space-x-2 transition-all shadow-glow-cyan hover:shadow-glow-cyan-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              <BiRefresh className={`w-4 h-4 text-cyan-400 ${loadingMore ? 'animate-spin' : ''}`} />
              <span>{loadingMore ? 'Sincronizando archivo...' : 'Cargar Más Sectores'}</span>
            </button>
          </div>
        </section>
      )}

      {/* Modal de Inspección Rápida en Caso de Requerirse */}
      {inspectingItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={inspectingItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl"
          onClick={() => setInspectingItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-6 sm:p-8 space-y-6 shadow-2xl relative hud-corner-brackets"
          >
            {/* Header del Modal */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold mb-2">
                  <BiCalendar className="w-3.5 h-3.5" />
                  <span>{inspectingItem.date}</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {inspectingItem.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setInspectingItem(null)}
                aria-label="Cerrar terminal de detalle"
                className="min-w-[48px] min-h-[48px] w-12 h-12 flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
              >
                <BiX className="w-6 h-6" />
              </button>
            </div>

            {/* Visualizador en Modal */}
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              {inspectingItem.media_type === 'video' ? (
                <div className="relative w-full aspect-video">
                  <iframe
                    src={inspectingItem.url}
                    title={inspectingItem.title}
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <ProgressiveImage
                  src={inspectingItem.url}
                  alt={inspectingItem.title}
                  aspectRatio="aspect-video"
                  priority={true}
                  fallbackSrc={inspectingItem.hdurl || undefined}
                />
              )}
            </div>

            {/* Información Científica */}
            <div className="space-y-4">
              {inspectingItem.copyright && (
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                  <BiCopyright className="w-4 h-4 text-slate-500" />
                  <span>Crédito: {inspectingItem.copyright.trim()}</span>
                </div>
              )}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {inspectingItem.explanation}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setInspectingItem(null);
                    handleOpenInApod(inspectingItem);
                  }}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-mono font-bold text-xs inline-flex items-center space-x-2 transition-all shadow-glow-cyan focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer active:scale-95"
                >
                  <BiRocket className="w-4 h-4" />
                  <span>Cargar en Visor APOD</span>
                </button>
                {inspectingItem.hdurl && (
                  <a
                    href={inspectingItem.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-mono text-xs inline-flex items-center space-x-2 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
                  >
                    <BiFullscreen className="w-4 h-4" />
                    <span>Ver Ultra HD</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
