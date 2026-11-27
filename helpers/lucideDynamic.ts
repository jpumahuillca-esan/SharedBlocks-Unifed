/// <reference path="../types/lucide-subpath.d.ts" />
/**
 * Cargador perezoso y normalizador para toda la librería @lucide/vue.
 *
 * Permite que AtomIcon mantenga un núcleo liviano de carga síncrona (SSR sin
 * parpadeo) y, al mismo tiempo, habilita a EditorIcon y al sitio público para
 * elegir y renderizar cualquiera de los ~1,800 íconos del paquete @lucide/vue.
 */
import { shallowRef } from 'vue';
import type { LucideIcon } from '@lucide/vue';

export interface DynamicLucideEntry {
  name: string;
  label: string;
  pascal: string;
}

interface LoadedLucideIndex {
  byKebab: Map<string, LucideIcon>;
  byCompact: Map<string, LucideIcon>;
  entries: DynamicLucideEntry[];
}

const loadedIndexRef = shallowRef<LoadedLucideIndex | null>(null);
let loadPromise: Promise<LoadedLucideIndex> | null = null;

/** Convierte PascalCase de Lucide ("Grid2x2", "Building2", "AArrowDown") a kebab-case. */
export const pascalToKebab = (name: string): string =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9]+)/g, (match, letter: string, digits: string, offset: number, whole: string) => {
      if ((letter === 'x' || letter === 'X') && offset > 0 && /[0-9]/.test(whole[offset - 1])) {
        return match;
      }
      return `${letter}-${digits}`;
    })
    .toLowerCase();

/** Convierte una clave kebab-case ("shield-check") a una etiqueta legible ("Shield Check"). */
export const formatLucideHumanLabel = (kebab: string): string =>
  kebab
    .split('-')
    .filter(Boolean)
    .map((part) => (/^\d+$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(' ');

const normalizeCompact = (name: string): string => name.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Carga bajo demanda todos los íconos de @lucide/vue una sola vez y los
 * indexa tanto por nombre kebab exacto como en forma compacta sin guiones.
 */
export async function ensureLucideLibraryLoaded(): Promise<LoadedLucideIndex> {
  if (loadedIndexRef.value) {
    return loadedIndexRef.value;
  }

  if (!loadPromise) {
    loadPromise = import('@lucide/vue/dist/esm/icons/index.mjs')
      .then((mod) => {
        const raw = mod as Record<string, unknown>;
        const byKebab = new Map<string, LucideIcon>();
        const byCompact = new Map<string, LucideIcon>();
        const seenComponents = new Set<unknown>();
        const entries: DynamicLucideEntry[] = [];

        for (const [pascal, candidate] of Object.entries(raw)) {
          if (
            typeof candidate !== 'function' ||
            pascal === 'default' ||
            pascal === 'icons' ||
            pascal === 'Icon' ||
            pascal.endsWith('Icon') ||
            pascal.startsWith('Lucide')
          ) {
            continue;
          }

          const kebab = pascalToKebab(pascal);
          const comp = candidate as LucideIcon;

          byKebab.set(kebab, comp);
          byCompact.set(normalizeCompact(kebab), comp);

          if (!seenComponents.has(candidate)) {
            seenComponents.add(candidate);
            entries.push({
              name: kebab,
              label: formatLucideHumanLabel(kebab),
              pascal,
            });
          }
        }

        entries.sort((a, b) => a.name.localeCompare(b.name));

        const built: LoadedLucideIndex = { byKebab, byCompact, entries };
        loadedIndexRef.value = built;
        return built;
      })
      .catch((err) => {
        loadPromise = null;
        throw err;
      });
  }

  return loadPromise;
}

export function isLucideLibraryLoaded(): boolean {
  return loadedIndexRef.value !== null;
}

export function getDynamicLucideIcon(name: string): LucideIcon | null {
  const index = loadedIndexRef.value;
  if (!index) return null;

  const clean = name.trim().toLowerCase();
  if (!clean) return null;

  return index.byKebab.get(clean) ?? index.byCompact.get(normalizeCompact(clean)) ?? null;
}

export function getLucideLibraryEntries(): DynamicLucideEntry[] {
  return loadedIndexRef.value?.entries ?? [];
}
