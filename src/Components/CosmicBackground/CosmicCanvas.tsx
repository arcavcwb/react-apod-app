import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  depth: number; // 1 (fondo), 2 (medio), 3 (cercano)
}

export const CosmicCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof canvas.getContext !== 'function') return;

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      return;
    }
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Generar estrellas sutiles (65 partículas en total para bajo consumo de GPU/CPU)
    const starCount = isTouch ? 35 : 65;
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const depth = Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 2 : 3;
      const baseAlpha = depth === 1 ? 0.2 + Math.random() * 0.25 : depth === 2 ? 0.35 + Math.random() * 0.3 : 0.6 + Math.random() * 0.35;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: depth === 1 ? 0.6 + Math.random() * 0.4 : depth === 2 ? 0.9 + Math.random() * 0.6 : 1.4 + Math.random() * 0.8,
        baseAlpha,
        alpha: baseAlpha,
        twinkleSpeed: 0.008 + Math.random() * 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.08 * depth,
        vy: (Math.random() - 0.5) * 0.08 * depth,
        depth,
      });
    }

    // Parallax muy sutil basado en mouse (1-3px máx)
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouch || prefersReducedMotion) return;
      const normX = (e.clientX / width) * 2 - 1;
      const normY = (e.clientY / height) * 2 - 1;
      targetParallaxX = normX * 3;
      targetParallaxY = normY * 3;
    };

    if (!isTouch && !prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Suavizado de parallax
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          // Desplazamiento lento continuo
          star.x += star.vx;
          star.y += star.vy;

          if (star.x < 0) star.x = width;
          else if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          else if (star.y > height) star.y = 0;

          // Titileo orgánico
          star.twinklePhase += star.twinkleSpeed;
          star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.2;
        }

        const renderX = star.x + currentParallaxX * star.depth;
        const renderY = star.y + currentParallaxY * star.depth;

        ctx.beginPath();
        ctx.arc(renderX, renderY, star.radius, 0, Math.PI * 2);

        // Coloración sutil: la mayoría blancas, algunas con tinte cian o índigo
        if (star.depth === 3) {
          ctx.fillStyle = `rgba(165, 243, 252, ${Math.max(0, Math.min(1, star.alpha))})`;
        } else if (star.depth === 2) {
          ctx.fillStyle = `rgba(224, 231, 255, ${Math.max(0, Math.min(1, star.alpha))})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, star.alpha))})`;
        }
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    // Pausar render si la pestaña pasa a segundo plano
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none will-change-transform"
    >
      {/* Fondo base ultra-oscuro */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Gradientes radiales de nebulosa profunda */}
      <div
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(99,102,241,0.15) 50%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[650px] h-[650px] rounded-full opacity-20 blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(168,85,247,0.15) 50%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-10 blur-[160px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(14,165,233,0.3) 0%, transparent 65%)',
        }}
      />

      {/* Trama de cuadrícula espacial tenue */}
      <div className="absolute inset-0 hud-grid-bg opacity-30" />

      {/* Canvas de estrellas vivas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
