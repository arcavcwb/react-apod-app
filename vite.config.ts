/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { statusFor, translateExplanation } from './netlify/edge-functions/translate/core.ts';

/**
 * Local development has no Netlify runtime: /api/translate runs the Edge Function's own code, with the keys in
 * .env. Translations are kept in memory while the server runs, standing in for the CDN cache, to spare the quota.
 */
function translateDevApi(env: Record<string, string>): Plugin {
  const kept = new Map<string, Awaited<ReturnType<typeof translateExplanation>>>();
  return {
    name: 'translate-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/translate', async (req, res) => {
        const query = new URL(req.url ?? '', 'http://localhost').searchParams;
        const key = `${query.get('lang')}:${query.get('date')}`;
        const result =
          kept.get(key) ??
          (await translateExplanation(query.get('date'), query.get('lang'), {
            deeplKey: env.DEEPL_API_KEY,
            nasaKey: env.VITE_NASA_API_KEY,
          }));
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
  plugins: [react(), translateDevApi(loadEnv(mode, process.cwd(), ''))],
  server: {
    port: 3000,
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    // Three.js is inherently large; it lives in its own lazy chunk (see OrrerySection).
    chunkSizeWarningLimit: 600,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
}));
