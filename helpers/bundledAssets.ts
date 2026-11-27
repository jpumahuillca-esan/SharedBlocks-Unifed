/**
 * Utilidades para imágenes por defecto empaquetadas en código (`assets/images/*`).
 *
 * Vite (`front`) compila los assets locales como `/assets/<nombre>-<hash>.ext`,
 * mientras que Nuxt (`public-site`) los emite como `/_nuxt/<nombre>.<hash>.ext`.
 * Un `Editor.vue` nunca debe guardar esas rutas con hash en MySQL; y si un bloque
 * ya las recibió guardadas de una sesión previa, en tiempo de renderizado se
 * traducen al asset compilado real del entorno actual.
 */

const BUNDLED_URL_RE = /^\/(?:assets|_nuxt)\/(.+)$/i;

/** Detecta si una URL proviene del empaquetado interno de Vite o Nuxt (o coincide con defaults inline). */
export const isBundledAssetUrl = (
  url: unknown,
  knownDefaultValues?: Iterable<string>,
): boolean => {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (BUNDLED_URL_RE.test(trimmed)) return true;

  if (knownDefaultValues) {
    for (const def of knownDefaultValues) {
      if (def && trimmed === def) return true;
    }
  }
  return false;
};

/**
 * Extrae la clave base de un archivo compilado por Vite/Nuxt para emparejarlo
 * entre builds distintos (ej. `/assets/dpa-faculty-law-Btia6WtK.jpg` -> `dpa-faculty-law`).
 */
export const extractBundledAssetKey = (url: string): string => {
  const match = url.trim().match(BUNDLED_URL_RE);
  if (!match) return '';

  const filename = match[1].split('?')[0].split('/').pop() || '';
  const withoutExt = filename.replace(/\.[a-z0-9]+$/i, '');
  // Vite suele usar `-<hash>`, Nuxt usa `.<hash>`.
  return withoutExt.replace(/[-.][A-Za-z0-9_-]{6,14}$/, '').toLowerCase();
};

/**
 * Resuelve la imagen a mostrar en `Block.vue`:
 * - Si el editor guardó una foto propia (`/storage/...`, `https://...`), la respeta intacta.
 * - Si está vacía o trae una ruta compilada `/assets/...` o `/_nuxt/...`, devuelve
 *   el asset compilado correspondiente del entorno actual (o `fallbackUrl`).
 */
export const resolveBundledImageFallback = (
  rawUrl: unknown,
  fallbackUrl: string,
  knownAssetsByKey?: Record<string, string>,
): string => {
  if (typeof rawUrl !== 'string') return fallbackUrl;
  const trimmed = rawUrl.trim();
  if (!trimmed) return fallbackUrl;

  if (isBundledAssetUrl(trimmed)) {
    const key = extractBundledAssetKey(trimmed);
    if (key && knownAssetsByKey?.[key]) {
      return knownAssetsByKey[key];
    }
    return fallbackUrl;
  }

  return trimmed;
};

/**
 * Limpia rutas internas de Vite/Nuxt antes de emitir/persistir datos desde `Editor.vue`
 * para guardar `''` en BD cuando no se seleccionó una imagen personalizada.
 */
export const stripBundledAssetForStorage = (
  rawUrl: unknown,
  knownDefaultValues?: Iterable<string>,
): string => {
  if (typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  return isBundledAssetUrl(trimmed, knownDefaultValues) ? '' : trimmed;
};

/**
 * Clona un payload de editor eliminando recursivamente URLs de assets empaquetados
 * (`/assets/...`, `/_nuxt/...` o defaults inline) para que jamás se guarden en BD.
 */
export const stripBundledAssetsDeep = <T>(
  value: T,
  knownDefaultValues?: Iterable<string>,
): T => {
  const defaultSet = knownDefaultValues ? new Set(knownDefaultValues) : undefined;

  const visit = (node: unknown): unknown => {
    if (typeof node === 'string') {
      return isBundledAssetUrl(node, defaultSet) ? '' : node;
    }
    if (Array.isArray(node)) {
      return node.map(visit);
    }
    if (node && typeof node === 'object') {
      const out: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(node as Record<string, unknown>)) {
        out[key] = visit(val);
      }
      return out;
    }
    return node;
  };

  return visit(value) as T;
};
