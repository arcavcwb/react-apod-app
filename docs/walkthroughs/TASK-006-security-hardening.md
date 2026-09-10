# Walkthrough Técnico - TASK-006: Hardening de Seguridad Integral y Auditoría Zero-Trust

## 1. Resumen Ejecutivo

En esta tarea se ejecutó una auditoría exhaustiva de seguridad sobre la aplicación, mitigando vulnerabilidades en dependencias, fortaleciendo cabeceras HTTP en producción y aplicando defensas en profundidad en el código frontend (XSS, Clickjacking, Inyección de Protocolos y Aislamiento de Iframes).

---

## 2. Auditoría de Secretos y Repositorio

- **Detección de Fugas en Git (`git log -S`)**: Verificación de historial completo. Cero claves, tokens o credenciales expuestas en commits.
- **Protección de Entorno**: El archivo `.env` está estrictamente ignorado por `.gitignore` y jamás ha sido rastreado por Git.
- **Plantilla Pública**: `.env.example` contiene únicamente `DEMO_KEY` como valor por defecto no sensible.

---

## 3. Mitigación de Vulnerabilidades de Dependencias

- **Vulnerabilidades Detectadas**:
  - `GHSA-wrjc-x8rr-h8h6` (Open redirect en `<Link>` y `useNavigate`)
  - `GHSA-337j-9hxr-rhxg` (Constructor injection en SSR hydration)
- **Acción Realizada**: Actualización de `react-router-dom` a `^7.18.3`.
- **Resultado Post-Audit (`pnpm audit`)**: **0 vulnerabilidades conocidas (0 moderadas, 0 altas, 0 críticas)**.

---

## 4. Cabeceras HTTP y Content Security Policy (`netlify.toml`)

Se agregaron cabeceras defensivas para la distribución en producción:
- **`Content-Security-Policy`**: Restricción estricta de orígenes. `script-src` bloqueado a `'self'`, `frame-src` restringido a YouTube y Vimeo, `connect-src` limitado a dominios de NASA, Unsplash y wsrv.
- **`X-Frame-Options: DENY`**: Mitigación absoluta de ataques de Clickjacking.
- **`X-Content-Type-Options: nosniff`**: Prevención de ataques basados en confusión de tipo MIME.
- **`Referrer-Policy: strict-origin-when-cross-origin`**: Protección de privacidad en cabeceras de referencia.
- **`Permissions-Policy`**: Bloqueo de APIs de hardware sensibles (cámara, micrófono, geolocalización, pagos).

---

## 5. Hardening en Código Frontend

- **Validación Estricta de Esquema Zod (`apod.contract.ts`)**: Validación de protocolo innegociable `https://` mediante `.refine()`, bloqueando esquemas maliciosos como `javascript:`, `data:` o `file:`.
- **Aislamiento de Iframes (`Apod.tsx` y `Gallery.tsx`)**: Inclusión de atributo `sandbox="allow-scripts allow-same-origin allow-presentation"`, impidiendo redirecciones de ventana superior o ejecución de plugins externos no autorizados.
- **Seguridad en Hipervínculos**: Estandarización de `rel="noopener noreferrer"` en todos los enlaces con `target="_blank"`.

---

## 6. Verificación Zero-Trust

| Prueba | Comando | Resultado |
|---|---|---|
| CVE Dependency Audit | `pnpm audit` | 0 vulnerabilidades |
| Impeccable Design | `echo Y \| pnpm run check:design` | 0 anti-patrones detectados |
| Pruebas Unitarias | `pnpm test` | 22 suites pasadas, 29 tests pasados (100%) |
| Compilación de Producción | `pnpm run build` | Compilado limpio en 1.06s |

---

## 7. Trazabilidad Git Flow

- **Rama**: `feat/TASK-006-security-hardening-and-audit`
- **Commit**: `sec(audit): patch react-router cves, configure strict csp headers, and harden sandbox links`
- **PR Destino**: `main` con squash merge.
