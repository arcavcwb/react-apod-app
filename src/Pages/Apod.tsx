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

function formatHumanDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new window.Date(window.Date.UTC(y, m - 1, d));
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  } catch {
    return dateStr;
  }
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
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-6 px-4 flex flex-col space-y-6">
      {/* Navegación Temporal Minimalista y Ergonómica */}
      <section
        aria-label="Navegación temporal de observaciones"
        className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md"
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrevDay}
            disabled={selectedDate === '1995-06-16'}
            title="Día Anterior"
            aria-label="Navegar al día anterior"
            className="min-h-[48px] px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-medium inline-flex items-center space-x-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            <BiChevronLeft className="w-5 h-5 text-cyan-400" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <input
            id="apod-date-picker"
            type="date"
            value={selectedDate}
            min="1995-06-16"
            max={today}
            onChange={handleDateChange}
            aria-label="Seleccionar fecha de observación astronómica"
            className="min-h-[48px] px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/60 cursor-pointer"
          />

          <button
            type="button"
            onClick={handleNextDay}
            disabled={selectedDate === today}
            title="Día Siguiente"
            aria-label="Navegar al día siguiente"
            className="min-h-[48px] px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-medium inline-flex items-center space-x-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <BiChevronRight className="w-5 h-5 text-cyan-400" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {selectedDate !== today && (
            <button
              type="button"
              onClick={handleToday}
              className="min-h-[48px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-cyan-300 border border-cyan-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer active:scale-95"
            >
              Hoy
            </button>
          )}

          <button
            type="button"
            onClick={handleRandomDate}
            title="Descubrir observación aleatoria"
            className="min-h-[48px] px-4 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-xs font-medium text-cyan-200 inline-flex items-center space-x-2 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer active:scale-95"
          >
            <BiShuffle className="w-4 h-4 text-cyan-400" />
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

      {/* Contenido Principal de Observación */}
      {data && !loading && (
        <article className={`space-y-6 ${getMotionClass()}`}>
          {/* Cabecera Editorial Humana */}
          <header className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center space-x-2 text-cyan-400">
                <BiCalendar className="w-4 h-4" />
                <time dateTime={data.date} className="font-semibold text-cyan-300 tracking-wide">
                  {formatHumanDate(data.date)}
                </time>
              </div>

              {data.copyright && (
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <BiCopyright className="w-3.5 h-3.5 text-slate-500" />
                  <span>Crédito: <strong className="text-slate-100 font-medium">{data.copyright.replace(/[\n\r]+/g, ' ').trim()}</strong></span>
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
              {data.title}
            </h1>
          </header>

          {/* Visor Cinematográfico de la Imagen */}
          <div className="relative group">
            {/* Halo sutil ambiental */}
            <div
              className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-indigo-500/10 to-purple-500/15 opacity-60 blur-xl group-hover:opacity-90 transition-opacity duration-500 pointer-events-none"
              aria-hidden="true"
            />

            {/* Marco de Imagen */}
            <div
              style={{ viewTransitionName: 'hero-apod-image' }}
              className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950 shadow-2xl"
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

                  {/* Acciones de Imagen */}
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
                        className="min-h-[48px] px-4 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-xs font-semibold text-cyan-300 border border-cyan-500/40 inline-flex items-center space-x-2 backdrop-blur-md transition-all shadow-glow-cyan hover:shadow-glow-cyan-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer active:scale-95"
                      >
                        <BiFullscreen className="w-4 h-4" />
                        <span className="hidden sm:inline">Ver en Ultra HD</span>
                        <span className="sm:hidden">UHD</span>
                      </a>
                    )}
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

          {/* Explicación Científica Editorial */}
          <section
            aria-label="Historia astronómica de la observación"
            className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 sm:p-10 backdrop-blur-md space-y-4"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Acerca de esta observación</span>
            </h2>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal max-w-4xl">
              {data.explanation}
            </p>
          </section>
        </article>
      )}
    </div>
  );
};
