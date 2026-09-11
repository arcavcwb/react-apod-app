import { useEffect } from 'react';

const APP = 'NASA APOD Explorer';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP}` : APP;
  }, [title]);
}
