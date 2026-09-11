import { NavigateFunction } from 'react-router-dom';

/**
 * Envoltorio progresivo de navegación mediante View Transitions API nativa del navegador.
 * Si el navegador no soporta startViewTransition, navega de manera estándar sin romper la aplicación.
 */
export function navigateWithViewTransition(navigate: NavigateFunction, to: string): void {
  if (
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    typeof (document as any).startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    (document as any).startViewTransition(() => {
      navigate(to);
    });
  } else {
    navigate(to);
  }
}
