import { flushSync } from 'react-dom';

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

let zooming: ViewTransition | undefined;

/**
 * Runs a change as a view transition in which only the photograph moves: it grows from its place into
 * the viewer, or back, while the rest of the page fades as one picture (see index.css).
 */
export function zoomTransition(update: () => void) {
  if (!document.startViewTransition) return update();
  const root = document.documentElement;
  root.dataset.zoom = 'photo';
  const transition = (zooming = document.startViewTransition(() => flushSync(update)));
  // A quick second click starts another before this one ends: only the last one clears the mark.
  transition.finished.finally(() => {
    if (zooming === transition) delete root.dataset.zoom;
  });
}
