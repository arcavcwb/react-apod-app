import React from 'react';

/** A tile of faint stars drawn once as SVG; a fixed seed keeps the sky the same on every visit. */
function starTile(size: number, count: number, seed: number, maxRadius: number): string {
  let s = seed;
  const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const stars = Array.from({ length: count }, () => {
    const x = (rand() * size).toFixed(1);
    const y = (rand() * size).toFixed(1);
    const r = (0.3 + rand() * maxRadius).toFixed(2);
    const o = (0.12 + rand() * 0.5).toFixed(2);
    return `<circle cx='${x}' cy='${y}' r='${r}' fill='%23dbe4ff' fill-opacity='${o}'/>`;
  }).join('');
  return `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${stars}</svg>")`;
}

const FAR = starTile(640, 64, 7, 0.45);
const NEAR = starTile(1100, 30, 42, 0.85);

/** Two still star layers, a low glow at the top of the sky and two faint nebula clouds. Nothing here competes with a photograph. */
export const SpaceBackground: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-8%,rgba(65,108,230,0.13),transparent_70%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_38%_at_90%_16%,rgba(124,92,240,0.09),transparent_70%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_52%_42%_at_6%_96%,rgba(55,198,232,0.06),transparent_70%)]" />
    <div className="absolute inset-0 opacity-80" style={{ backgroundImage: FAR }} />
    <div className="stars-near absolute inset-x-0 top-0 h-[110vh]" style={{ backgroundImage: NEAR }} />
  </div>
);
