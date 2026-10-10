/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { answerApod, type ApodAnswer } from './netlify/edge-functions/apod/core.ts';
import { statusFor, translateExplanation } from './netlify/edge-functions/translate/core.ts';

/**
 * Local development has no Netlify runtime: /api/apod and /api/translate run the Edge Functions' own code,
 * with the key in .env. What can no longer change is kept in memory while the server runs, standing in
 * for the CDN cache, to spare NASA's site and the translation quota.
 */
function devApi(env: Record<string, string>): Plugin {
  const days = new Map<string, ApodAnswer>();
  const kept = new Map<string, Awaited<ReturnType<typeof translateExplanation>>>();
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api/apod', async (req, res) => {
        const query = new URL(req.url ?? '', 'http://localhost').searchParams;
        const key = query.toString();
        const answer = days.get(key) ?? (await answerApod(query));
        if (!answer.open) days.set(key, answer);
        res.statusCode = answer.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(answer.body));
      });
      server.middlewares.use('/api/translate', async (req, res) => {
        const query = new URL(req.url ?? '', 'http://localhost').searchParams;
        const key = `${query.get('lang')}:${query.get('date')}`;
        const result = kept.get(key) ?? (await translateExplanation(query.get('date'), query.get('lang'), { deeplKey: env.DEEPL_API_KEY }));
        if (result.ok) kept.set(key, result);
        res.statusCode = result.ok ? 200 : statusFor(result.error);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result.ok ? result.translation : { error: result.error }));
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  // The third argument loads every variable, not only VITE_ ones: DEEPL_API_KEY stays on the server.
  plugins: [react(), devApi(loadEnv(mode, process.cwd(), ''))],
  server: {
    port: 3000,
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
}));
