import React, { useState, useEffect, useRef } from 'react';
import {
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  LinkedinShareButton,
} from 'react-share';
import {
  BiX,
  BiCopy,
  BiCheck,
  BiShareAlt,
  BiDownload,
  BiRadioCircleMarked,
} from 'react-icons/bi';
import {
  SiX,
  SiWhatsapp,
  SiTelegram,
  SiLinkedin,
} from 'react-icons/si';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  imageUrl?: string;
  date: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  imageUrl,
  date,
}) => {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback manual si clipboard API no está disponible
      setCopied(false);
    }
  };

  const shareText = `Observación astronómica oficial de la NASA: "${title}" (${date})`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-portal-entry"
    >
      {/* Backdrop click listener */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Card HUD */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-slate-950/95 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] backdrop-blur-2xl z-10 hud-corner-brackets"
      >
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BiShareAlt className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold block">
                CANAL DE TRANSMISIÓN // EXTERNO
              </span>
              <h2 id="share-modal-title" className="text-base sm:text-lg font-bold text-white">
                Compartir Observación
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de compartir"
            className="min-h-[48px] min-w-[48px] rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
          >
            <BiX className="w-5 h-5" />
          </button>
        </div>

        {/* Ficha Resumen de la Observación */}
        <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 mb-6 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>REGISTRO NASA: APOD-{date.replace(/-/g, '')}</span>
            <span className="text-cyan-400 flex items-center space-x-1">
              <BiRadioCircleMarked className="w-3.5 h-3.5 animate-pulse" />
              <span>ACTIVO</span>
            </span>
          </div>
          <p className="text-sm font-semibold text-white truncate">{title}</p>
        </div>

        {/* Canales de Difusión Social */}
        <div className="space-y-4 mb-6">
          <label className="text-xs font-mono text-slate-400 block tracking-wider uppercase">
            Canales de Transmisión Directa
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* X / Twitter */}
            <TwitterShareButton
              url={url}
              title={shareText}
              hashtags={['NASA', 'APOD', 'Cosmos']}
              className="w-full !flex"
            >
              <div className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-800 hover:border-cyan-500/50 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white text-xs font-mono flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer">
                <SiX className="w-4 h-4 text-cyan-400" />
                <span>X / Twitter</span>
              </div>
            </TwitterShareButton>

            {/* WhatsApp */}
            <WhatsappShareButton
              url={url}
              title={shareText}
              separator=" :: "
              className="w-full !flex"
            >
              <div className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-800 hover:border-emerald-500/50 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white text-xs font-mono flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer">
                <SiWhatsapp className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </div>
            </WhatsappShareButton>

            {/* Telegram */}
            <TelegramShareButton
              url={url}
              title={shareText}
              className="w-full !flex"
            >
              <div className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-800 hover:border-sky-500/50 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white text-xs font-mono flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer">
                <SiTelegram className="w-4 h-4 text-sky-400" />
                <span>Telegram</span>
              </div>
            </TelegramShareButton>

            {/* LinkedIn */}
            <LinkedinShareButton
              url={url}
              title={title}
              summary={shareText}
              source="NASA APOD Explorer"
              className="w-full !flex"
            >
              <div className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white text-xs font-mono flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer">
                <SiLinkedin className="w-4 h-4 text-indigo-400" />
                <span>LinkedIn</span>
              </div>
            </LinkedinShareButton>
          </div>
        </div>

        {/* Copiar Enlace Directo (Clipboard API) */}
        <div className="space-y-2 mb-6">
          <label htmlFor="share-link-input" className="text-xs font-mono text-slate-400 block tracking-wider uppercase">
            Enlace Permanente
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="share-link-input"
              type="text"
              readOnly
              value={url}
              className="flex-1 min-h-[48px] px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500/60 selection:bg-cyan-500/30"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copiar enlace"
              className={`min-h-[48px] px-4 rounded-xl border text-xs font-mono font-semibold flex items-center space-x-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 active:scale-95 ${
                copied
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-cyan-950 border-cyan-400 font-bold shadow-glow-cyan'
              }`}
            >
              {copied ? (
                <>
                  <BiCheck className="w-4 h-4" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <BiCopy className="w-4 h-4" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Descarga Directa si hay imagen */}
        {imageUrl && (
          <div className="border-t border-slate-800 pt-4 flex justify-end">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="min-h-[48px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white border border-slate-700/80 flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <BiDownload className="w-4 h-4 text-cyan-400" />
              <span>Abrir Archivo RAW Original</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
