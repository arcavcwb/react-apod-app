import React, { useState } from 'react';
import { BiShareAlt } from 'react-icons/bi';
import { ShareModal } from './ShareModal';

interface ShareButtonProps {
  title: string;
  date: string;
  url?: string;
  imageUrl?: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  date,
  url,
  imageUrl,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleShareClick = async () => {
    const shareData = {
      title: `${title} — NASA APOD Explorer`,
      text: `Observación astronómica oficial de la NASA: "${title}" (${date})`,
      url: shareUrl,
    };

    // Intentar Web Share API nativo si está disponible
    if (
      typeof navigator !== 'undefined' &&
      navigator.share &&
      navigator.canShare?.(shareData)
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        // Si el usuario cancela (AbortError), no hacer nada
        if (err?.name === 'AbortError') return;
      }
    }

    // Fallback: abrir modal sci-fi multi-canal
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleShareClick}
        aria-label={`Compartir observación: ${title}`}
        className={`min-h-[48px] px-4 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/40 inline-flex items-center space-x-2 backdrop-blur-md transition-all shadow-glow-cyan hover:shadow-glow-cyan-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer active:scale-95 ${className}`}
      >
        <BiShareAlt className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span>Compartir</span>
      </button>

      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        date={date}
        url={shareUrl}
        imageUrl={imageUrl}
      />
    </>
  );
};
