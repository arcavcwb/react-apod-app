import React, { useState, useEffect } from 'react';
import { fetchApodByDate } from '../services/nasa.service';
import { ApodItem } from '../contracts/apod.contract';
import { ProgressiveImage } from '../Components/Media/ProgressiveImage';
import { Spinner } from '../Components/Spinner/Spinner';
import { ShareButton } from '../Components/Share/ShareButton';
import {
  BiCalendar,
  BiRefresh,
  BiFullscreen,
  BiShuffle,
  BiCopyright,
  BiInfoCircle,
  BiShieldQuarter,
  BiChevronLeft,
  BiChevronRight,
  BiRadar,
  BiRadioCircleMarked,
  BiRocket,
} from 'react-icons/bi';

function getTodayString(): string {
  const now = new window.Date();
  return now.toISOString().split('T')[0];
}

function getRandomDateString(): string {
  const start = new window.Date('1995-06-16T12:00:00Z').getTime();
  const end = new window.Date().getTime();
  const randomTime = start + Math.random() * (end - start);
  return new window.Date(randomTime).toISOString().split('T')[0];
}

function shiftDate(dateStr: string, days: number): string {
  const d = new window.Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  const minDate = new window.Date('1995-06-16T12:00:00Z');
  const maxDate = new window.Date(getTodayString() + 'T12:00:00Z');
  if (d < minDate) return '1995-06-16';
  if (d > maxDate) return getTodayString();
  return d.toISOString().split('T')[0];
}

function getInitialDate(): string {
  if (typeof window !== 'undefined' && window.location && window.location.search) {
    try {
      const params = new URLSearchParams(window.location.search);
      const dateParam = params.get('date');
      if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        return dateParam;
      }
    } catch {
      // Fallback a today en caso de error de parseo
    }
  }
  return getTodayString();
}

export const Apod: React.FC = () => {
  const today = getTodayString();
  const [selectedDate, setSelectedDate] = useState<string>(getInitialDate);
  const [data, setData] = useState<ApodItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [transitionMode, setTransitionMode] = useState<'portal' | 'next' | 'prev' | 'random'>('portal');

  // Sincronizar si el usuario navega en el historial
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const urlDate = getInitialDate();
      if (urlDate !== selectedDate) {
        setSelectedDate(urlDate);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedDate]);

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      const res = await fetchApodByDate(selectedDate === today ? undefined : selectedDate);
      if (isCancelled) return;

      if (res.error) {
        setError(res.error);
        setData(null);
        setIsFallback(false);
      } else {
        setData(res.data);
        setIsFallback(!!res.isFallback);
      }
      setLoading(false);
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [selectedDate, today]);

  const changeDateWithTransition = (newDate: string, mode: 'portal' | 'next' | 'prev' | 'random') => {
    setTransitionMode(mode);

    if (typeof window !== 'undefined' && window.location) {
      try {
        const url = new URL(window.location.href);
        if (newDate === today) {
          url.searchParams.delete('date');
        } else {
          url.searchParams.set('date', newDate);
        }
        window.history.replaceState({}, '', url.toString());
      } catch {
        // Ignorar en entornos sin soporte completo de URL/history
      }
    }

    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      typeof (document as any).startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      (document as any).startViewTransition(() => {
        setSelectedDate(newDate);
      });
    } else {
      setSelectedDate(newDate);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeDateWithTransition(e.target.value, 'portal');
  };

  const handlePrevDay = () => {
    const prev = shiftDate(selectedDate, -1);
    changeDateWithTransition(prev, 'prev');
  };

  const handleNextDay = () => {
    const next = shiftDate(selectedDate, 1);
    changeDateWithTransition(next, 'next');
  };

  const handleRandomDate = () => {
    changeDateWithTransition(getRandomDateString(), 'random');
  };

  const handleToday = () => {
    changeDateWithTransition(today, 'portal');
  };

  const handleManualRetry = async () => {
    setLoading(true);
    setError(null);
    const res = await fetchApodByDate(selectedDate === today ? undefined : selectedDate, true);
    if (res.error) {
      setError(res.error);
      setData(null);
      setIsFallback(false);
    } else {
      setData(res.data);
      setIsFallback(!!res.isFallback);
    }
    setLoading(false);
  };

  // Determinar clase de animación espacial
  const getMotionClass = () => {
    switch (transitionMode) {
      case 'next':
        return 'animate-slide-next';
      case 'prev':
        return 'animate-slide-prev';
      case 'random':
        return 'animate-quantum-jump';
      default:
        return 'animate-portal-entry';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col space-y-8">
      {/* Controles de la Consola Orbital: Navegación Espacio-Temporal */}
      <section
        aria-label="Consola de navegación temporal astronómica"
        className="relative rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl shadow-hud-panel flex flex-col md:flex-row items-center justify-between gap-4 hud-corner-brackets"
      >
        {/* Cabecera del Control */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-11 h-11 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-glow-cyan flex-shrink-0">
            <BiRadar className="w-6 h-6 animate-spin" style={{ animationDuration: '14s' }} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Coordenada Temporal</span>
            </span>
            <span className="text-xs text-slate-300 font-medium">Archivo APOD desde 1995.06.16</span>
          </div>
        </div>

        {/* Grupo de Botones de Navegación Espacial */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
          {/* Botón Día Anterior */}
          <button
            type="button"
            onClick={handlePrevDay}
            disabled={selectedDate === '1995-06-16'}
            title="Día Anterior"
            aria-label="Navegar al día anterior"
            className="min-h-[48px] min-w-[48px] px-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/50 text-xs font-mono inline-flex items-center justify-center space-x-1 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            <BiChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Selector de Fecha Nativo */}
          <div className="relative">
            <input
              id="apod-date-picker"
              type="date"
              value={selectedDate}
              min="1995-06-16"
              max={today}
              onChange={handleDateChange}
              aria-label="Seleccionar fecha de observación astronómica"
              className="min-h-[48px] px-4 py-2 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-cyan-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/60 shadow-inner cursor-pointer"
            />
          </div>

          {/* Botón Día Siguiente */}
          <button
            type="button"
            onClick={handleNextDay}
            disabled={selectedDate === today}
            title="Día Siguiente"
            aria-label="Navegar al día siguiente"
            className="min-h-[48px] min-w-[48px] px-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/50 text-xs font-mono inline-flex items-center justify-center space-x-1 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <BiChevronRight className="w-5 h-5" />
          </button>

          {/* Botón Hoy */}
          <button
            type="button"
            onClick={handleToday}
            disabled={selectedDate === today}
            className="min-h-[48px] px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-mono font-semibold text-slate-200 hover:text-white border border-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer active:scale-95"
          >
            Hoy
          </button>

          {/* Botón Salto Cuántico Aleatorio */}
          <button
            type="button"
            onClick={handleRandomDate}
            title="Salto Cuántico a fecha aleatoria"
            className="min-h-[48px] px-4 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-xs font-mono font-semibold text-cyan-300 inline-flex items-center space-x-2 transition-all shadow-glow-cyan hover:shadow-glow-cyan-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer active:scale-95"
          >
            <BiShuffle className="w-4 h-4" />
            <span>Aleatorio</span>
          </button>
        </div>
      </section>

      {/* Banner de Resiliencia / Modo Fallback */}
      {isFallback && !loading && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 text-amber-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs sm:text-sm backdrop-blur-md shadow-lg">
          <div className="flex items-center space-x-3">
            <BiShieldQuarter className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-amber-300 font-mono">[CANAL DE CONTINGENCIA ACTIVO]:</strong> Cuota pública temporalmente saturada. Se presenta observación de alta definición desde el archivo local curado.
            </p>
          </div>
          <button
            type="button"
            onClick={handleManualRetry}
            className="min-h-[48px] px-4 py-2 rounded-lg bg-amber-900/50 hover:bg-amber-800/60 text-amber-200 border border-amber-500/50 text-xs font-mono font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-400/50 active:scale-95"
          >
            <BiRefresh className="w-4 h-4" />
            <span>Reconectar en Vivo</span>
          </button>
        </div>
      )}

      {/* Estado de Carga */}
      <Spinner loading={loading} />

      {/* Estado de Error */}
      {error && !loading && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-8 text-center flex flex-col items-center justify-center space-y-4 backdrop-blur-xl shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-900/40 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <BiInfoCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">Fallo en Transmisión de Datos</h2>
          <p className="text-sm text-slate-300 max-w-md">{error}</p>
          <button
            type="button"
            onClick={handleManualRetry}
            className="min-h-[48px] px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono font-semibold text-cyan-300 border border-cyan-500/40 inline-flex items-center space-x-2 transition-all shadow-glow-cyan focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer active:scale-95"
          >
            <BiRefresh className="w-4 h-4" />
            <span>Reintentar Telemetría</span>
          </button>
        </div>
      )}

      {/* Contenido de Observación Científica Principal */}
      {data && !loading && (
        <article className={`space-y-8 ${getMotionClass()}`}>
          {/* Ficha Técnica de Telemetría Superior */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-md text-xs font-mono text-slate-300">
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Identificador</span>
              <span className="text-cyan-300 font-bold">APOD-{data.date.replace(/-/g, '')}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Tipo de Medio</span>
              <span className="text-indigo-300 font-bold uppercase">{data.media_type}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Protocolo</span>
              <span className="text-emerald-400 font-bold">HTTPS SECURE</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Crédito</span>
              <span className="text-slate-300 truncate block">{data.copyright?.trim() || 'NASA / Dominio Público'}</span>
            </div>
          </div>

          {/* Título Principal de la Observación */}
          <header className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              {data.title}
            </h1>
          </header>

          {/* Visor Espacial / Space Portal Media Frame */}
          <div className="relative group">
            {/* Halo de resplandor ambiental estelar */}
            <div
              className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/15 to-purple-500/20 opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              aria-hidden="true"
            />

            {/* Contenedor del Medio */}
            <div
              style={{ viewTransitionName: 'hero-apod-image' }}
              className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950 shadow-2xl hud-corner-brackets"
            >
              {data.media_type === 'image' ? (
                <div className="relative">
                  <ProgressiveImage
                    src={data.url}
                    alt={data.title}
                    aspectRatio="aspect-video"
                    priority={true}
                    fallbackSrc={data.hdurl || undefined}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                  />

                  {/* Badges de Telemetría Flotantes sobre la Imagen */}
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono tracking-widest backdrop-blur-md shadow-lg">
                      <BiRadioCircleMarked className="w-3.5 h-3.5 text-cyan-400 animate-ping" />
                      <span>OPTICAL APERTURE // LIVE</span>
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <ShareButton
                      title={data.title}
                      date={data.date}
                      imageUrl={data.hdurl || data.url}
                    />
                    {data.hdurl && (
                      <a
                        href={data.hdurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[48px] px-4 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/40 inline-flex items-center space-x-2 backdrop-blur-md transition-all shadow-glow-cyan hover:shadow-glow-cyan-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer active:scale-95"
                      >
                        <BiFullscreen className="w-4 h-4" />
                        <span className="hidden sm:inline">Ver en Ultra HD</span>
                        <span className="sm:hidden">UHD</span>
                      </a>
                    )}
                  </div>

                  {/* Coordenadas Técnicas Decorativas Inferiores */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[9px] font-mono text-slate-400 pointer-events-none drop-shadow">
                    <span className="hidden sm:inline">RA 18h 36m // DEC +38° 47'</span>
                    <span className="ml-auto bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800/80 backdrop-blur-sm">
                      ISO {data.date}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full aspect-video bg-slate-950">
                  <div className="absolute top-4 right-4 z-10">
                    <ShareButton
                      title={data.title}
                      date={data.date}
                    />
                  </div>
                  <iframe
                    src={data.url}
                    title={data.title}
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Dossier de Explicación Astrofísica */}
          <section
            aria-label="Explicación astronómica oficial"
            className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-xl space-y-4 shadow-hud-panel"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white tracking-wider font-mono uppercase flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Explicación Astrofísica Oficial</span>
              </h2>
              <span className="text-[10px] font-mono text-cyan-400/80 hidden sm:inline">
                STATUS: VERIFIED
              </span>
            </div>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
              {data.explanation}
            </p>
          </section>
        </article>
      )}
    </div>
  );
};
