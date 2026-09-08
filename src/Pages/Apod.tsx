import React, { useState, useEffect, useCallback } from 'react';
import { fetchApodByDate } from '../services/nasa.service';
import { ApodItem } from '../contracts/apod.contract';
import { ProgressiveImage } from '../Components/Media/ProgressiveImage';
import { Spinner } from '../Components/Spinner/Spinner';
import {
  BiCalendar,
  BiRefresh,
  BiFullscreen,
  BiShuffle,
  BiCopyright,
  BiInfoCircle,
} from 'react-icons/bi';

function getTodayString(): string {
  const now = new window.Date();
  return now.toISOString().split('T')[0];
}

function getRandomDateString(): string {
  const start = new window.Date('1995-06-16').getTime();
  const end = new window.Date().getTime();
  const randomTime = start + Math.random() * (end - start);
  return new window.Date(randomTime).toISOString().split('T')[0];
}

export const Apod: React.FC = () => {
  const today = getTodayString();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [data, setData] = useState<ApodItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadApod = useCallback(async (dateToFetch?: string) => {
    setLoading(true);
    setError(null);
    const target = dateToFetch || selectedDate;
    const response = await fetchApodByDate(target === today ? undefined : target);
    if (response.error) {
      setError(response.error);
      setData(null);
    } else {
      setData(response.data);
      if (response.data?.date) {
        setSelectedDate(response.data.date);
      }
    }
    setLoading(false);
  }, [selectedDate, today]);

  useEffect(() => {
    loadApod();
  }, [loadApod]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  const handleRandomDate = () => {
    const randomDate = getRandomDateString();
    setSelectedDate(randomDate);
  };

  const handleToday = () => {
    setSelectedDate(today);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 flex flex-col space-y-8">
      {/* Controles del Observatorio: Selector de Fecha y Acciones Rápidas */}
      <section
        aria-label="Controles de fecha astronómica"
        className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BiCalendar className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="apod-date-picker" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Fecha de Observación
            </label>
            <span className="text-xs text-slate-500">Desde el 16 de junio de 1995</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input
            id="apod-date-picker"
            type="date"
            value={selectedDate}
            min="1995-06-16"
            max={today}
            onChange={handleDateChange}
            className="min-h-[48px] px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
          />
          <button
            type="button"
            onClick={handleToday}
            disabled={selectedDate === today}
            className="min-h-[48px] px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={handleRandomDate}
            className="min-h-[48px] px-4 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-xs font-semibold text-cyan-300 inline-flex items-center space-x-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          >
            <BiShuffle className="w-4 h-4" />
            <span>Aleatoria</span>
          </button>
        </div>
      </section>

      {/* Estado de Carga */}
      <Spinner loading={loading} />

      {/* Estado de Error Defensivo */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-6 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-900/40 flex items-center justify-center text-red-400">
            <BiInfoCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">No se pudo obtener la observación</h2>
          <p className="text-sm text-slate-300 max-w-md">{error}</p>
          <button
            type="button"
            onClick={() => loadApod()}
            className="min-h-[48px] px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 inline-flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          >
            <BiRefresh className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
        </div>
      )}

      {/* Contenido Astronómico Principal */}
      {data && !loading && (
        <article className="space-y-6">
          {/* Cabecera del Documento */}
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
                <BiCalendar className="w-3.5 h-3.5" />
                <span>{data.date}</span>
              </span>
              {data.copyright && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs">
                  <BiCopyright className="w-3.5 h-3.5 text-slate-500" />
                  <span>Crédito: {data.copyright.trim()}</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {data.title}
            </h1>
          </header>

          {/* Visualizador de Medios */}
          <div className="space-y-3">
            {data.media_type === 'image' ? (
              <div className="relative group">
                <ProgressiveImage
                  src={data.url}
                  alt={data.title}
                  aspectRatio="aspect-video"
                  priority={true}
                  className="shadow-2xl"
                />
                {data.hdurl && (
                  <div className="absolute top-4 right-4 opacity-90 group-hover:opacity-100 transition-opacity">
                    <a
                      href={data.hdurl}
                      target="_blank"
                      rel="noreferrer"
                      className="min-h-[48px] px-4 py-2 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-xs font-semibold text-cyan-300 border border-cyan-500/30 inline-flex items-center space-x-2 backdrop-blur-md transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                    >
                      <BiFullscreen className="w-4 h-4" />
                      <span>Ver en HD / 4K</span>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                <iframe
                  src={data.url}
                  title={data.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            )}
          </div>

          {/* Explicación Astrofísica */}
          <section
            aria-label="Explicación astronómica oficial"
            className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-md space-y-4"
          >
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center space-x-2">
              <span className="w-1.5 h-4 rounded-full bg-cyan-400 inline-block"></span>
              <span>Explicación Astrofísica Oficial</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {data.explanation}
            </p>
          </section>
        </article>
      )}
    </div>
  );
};
