export type Direction = 'prev' | 'next';

/** Marks the next view transition as travel, so what changes slides the way the dates go (see index.css). */
export function markTravel(direction?: Direction) {
  const root = document.documentElement;
  if (!direction) return;
  root.dataset.travel = direction;
  window.setTimeout(() => delete root.dataset.travel, 1200);
}

/** Marks the next view transition as a tile growing into a photograph: texts fade through, and the home hero steps aside. */
export function markMorph() {
  const root = document.documentElement;
  root.dataset.morph = 'tile';
  window.setTimeout(() => delete root.dataset.morph, 1200);
}
