/**
 * Tokens de arcis-2 leídos de sus archivos, para las páginas de Foundations.
 *
 * Las páginas de Foundations no llevan listas escritas a mano: todo sale de
 * aquí, y aquí todo sale de los archivos que usa la web.
 *
 *   ds/ds-tokens.css      el export de Figma, tal cual
 *   ds/_extensions.scss   lo que arcis-2 aún no define (sombras, transiciones…)
 *   breakpoints.scss      el mapa $breakpoints que usan los mixins
 *
 * Se importan como texto (`?raw`) y se leen al cargar el módulo. Así, cuando
 * Figma exporte de nuevo y se reemplace ds-tokens.css, la documentación muestra
 * los tokens nuevos sin tocar nada más.
 *
 * Los grupos son los comentarios de una línea del propio export
 * (`/* Color / red *\/`, `/* Color / Background *\/`…), y la capa sale de sus
 * separadores (1. FOUNDATIONS, 2. SEMÁNTICOS, 3. RESPONSIVE).
 *
 * Los valores se resuelven siguiendo la cadena de var() dentro de estos mismos
 * archivos, no con getComputedStyle: así se pueden mostrar a la vez el valor
 * de escritorio y el de móvil de un token responsive, sea cual sea el ancho de
 * la ventana en la que se mira la documentación.
 */
import dsTokensSource from '../../../assets/styles/ds/ds-tokens.css?raw';
import extensionsSource from '../../../assets/styles/ds/_extensions.scss?raw';
import breakpointsSource from '../../../assets/styles/breakpoints.scss?raw';

export type TokenLayer = 'foundation' | 'semantic' | 'responsive' | 'extension';
export type TokenMode = 'desktop' | 'mobile';

export interface DsToken {
  name: string;
  /** Valor tal como está escrito (puede ser un var()). */
  value: string;
  /** Valor por debajo de md (768px), si el token cambia en móvil. */
  mobile?: string;
  group: string;
  layer: TokenLayer;
}

export interface DsGroup {
  title: string;
  layer: TokenLayer;
  tokens: DsToken[];
}

const LAYER_MARKERS: Array<[RegExp, TokenLayer]> = [
  [/\b1\.\s*FOUNDATIONS\b/, 'foundation'],
  [/\b2\.\s*SEM[AÁ]NTICOS\b/i, 'semantic'],
  [/\b3\.\s*RESPONSIVE\b/, 'responsive'],
];

/**
 * Recorre un archivo de tokens: comentarios, declaraciones y llaves.
 *
 * Los comentarios de fuera de `:root` (la cabecera del archivo) se ignoran,
 * porque la del export nombra las tres capas de corrido. Lo que va dentro de
 * un @media es la versión móvil: no forma grupo, solo aporta `mobile`.
 */
const parse = (source: string, defaultLayer: TokenLayer) => {
  const groups: DsGroup[] = [];
  const mobile: Record<string, string> = {};
  let layer = defaultLayer;
  let group: DsGroup | null = null;
  let depth = 0;
  let mediaDepth = -1;

  const pattern = /\/\*([\s\S]*?)\*\/|@media[^{]*\{|(--[\w-]+)\s*:\s*([^;]+);|\{|\}/g;

  for (const match of source.matchAll(pattern)) {
    const [whole, comment, name, value] = match;

    if (comment !== undefined) {
      if (depth === 0) continue;
      const marker = LAYER_MARKERS.find(([re]) => re.test(comment));
      if (marker) {
        layer = marker[1];
        group = null;
      } else if (!comment.includes('\n') && mediaDepth < 0) {
        group = { title: comment.trim(), layer, tokens: [] };
        groups.push(group);
      }
      continue;
    }

    if (whole.startsWith('@media')) {
      mediaDepth = depth;
      depth++;
      continue;
    }
    if (whole === '{') { depth++; continue; }
    if (whole === '}') {
      depth--;
      if (depth === mediaDepth) mediaDepth = -1;
      continue;
    }

    if (name) {
      const clean = value.trim();
      if (mediaDepth >= 0) {
        mobile[name] = clean;
        continue;
      }
      if (!group) {
        group = { title: 'General', layer, tokens: [] };
        groups.push(group);
      }
      group.tokens.push({ name, value: clean, group: group.title, layer });
    }
  }

  for (const g of groups) for (const token of g.tokens) {
    if (mobile[token.name] !== undefined && mobile[token.name] !== token.value) token.mobile = mobile[token.name];
  }
  return groups;
};

const extensionGroups = parse(extensionsSource, 'extension');
const figmaGroups = parse(dsTokensSource, 'foundation');

/** Todos los grupos: primero los de Figma y después las extensiones locales. */
export const DS_GROUPS: DsGroup[] = [...figmaGroups, ...extensionGroups];

/*
 * Índice por nombre. Las extensiones se cargan en la web ANTES que el export
 * (ver tokens.scss), así que si un nombre está en los dos gana el de Figma:
 * aquí se indexan en ese mismo orden.
 */
const BY_NAME = new Map<string, DsToken>();
for (const g of [...extensionGroups, ...figmaGroups]) for (const token of g.tokens) BY_NAME.set(token.name, token);

export const DS_TOKENS: DsToken[] = [...BY_NAME.values()];

export const getToken = (name: string) => BY_NAME.get(name);

/** Tokens cuyo nombre empieza por el prefijo, en el orden del archivo. */
export const tokensByPrefix = (prefix: string) => DS_TOKENS.filter((token) => token.name.startsWith(prefix));

/** Grupos de una capa cuyo título empieza por el texto dado (p. ej. 'Color /'). */
export const groupsWhere = (layer: TokenLayer, titlePrefix = '') =>
  DS_GROUPS.filter((g) => g.layer === layer && g.title.startsWith(titlePrefix) && g.tokens.length);

/** Sustituye cada var() por su valor final, en escritorio o en móvil. */
export const resolveValue = (value: string, mode: TokenMode = 'desktop', depth = 0): string =>
  depth > 12
    ? value
    : value.replace(/var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)/g, (whole, name: string) => {
        const token = BY_NAME.get(name);
        if (!token) return whole;
        const raw = mode === 'mobile' && token.mobile !== undefined ? token.mobile : token.value;
        return resolveValue(raw, mode, depth + 1);
      });

export const resolveToken = (name: string, mode: TokenMode = 'desktop') => resolveValue(`var(${name})`, mode);

/**
 * El token al que apunta directamente, si su valor es un solo var().
 * Es lo que muestra "→ red-500" junto a un semántico.
 */
export const referenceOf = (token: DsToken, mode: TokenMode = 'desktop') => {
  const raw = mode === 'mobile' && token.mobile !== undefined ? token.mobile : token.value;
  return raw.match(/^var\(\s*(--[\w-]+)\s*\)$/)?.[1] ?? null;
};

/** ¿Cambia su valor final por debajo de md? */
export const isResponsive = (name: string) => resolveToken(name, 'desktop') !== resolveToken(name, 'mobile');

/** Nombre sin el prefijo común, para las etiquetas de las muestras. */
export const shortName = (name: string, prefix = '--ds-') => name.replace(prefix, '');

/* ------------------------------------------------------------------------
   Breakpoints: el mapa Sass de breakpoints.scss, el que usan los mixins.
   ------------------------------------------------------------------------ */

export interface DsBreakpoint {
  name: string;
  value: string;
  /** Lo que dice --ds-breakpoint-<name> en el export de Figma, si existe. */
  figma?: string;
}

export const DS_BREAKPOINTS: DsBreakpoint[] = (() => {
  const map = breakpointsSource.match(/\$breakpoints\s*:\s*\(([\s\S]*?)\);/)?.[1] ?? '';
  return [...map.matchAll(/^\s*'([\w-]+)'\s*:\s*([^,\n]+)/gm)].map(([, name, value]) => ({
    name,
    value: value.trim(),
    figma: getToken(`--ds-breakpoint-${name}`)?.value,
  }));
})();

/** Corte de la versión móvil de ds-tokens.css (`@media (max-width: …)`). */
export const MOBILE_QUERY = dsTokensSource.match(/@media\s*\(([^)]*)\)/)?.[1] ?? '';
