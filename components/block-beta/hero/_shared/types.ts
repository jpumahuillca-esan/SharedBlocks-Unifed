/**
 * Modelo de datos del carrusel de portada.
 *
 * Misma idea que en el resto de familias de block-beta: aquí solo vive el dato
 * que el editor guarda y que el bloque reparte. El aspecto lo ponen los átomos
 * y la hoja assets/styles/elements/_hero.scss.
 */
import { normalizeLinkTarget, type LinkTarget } from '../../../../helpers/linkTarget';
import type { ImageFocusProfiles } from '../../../../helpers/imageFocus';
import {
    BRAND_COLOR_GROUPS,
    DARK_TEXT_BACKGROUND_TOKENS,
} from '../../../editor-beta/EditorBrandColor/brandColors';

/** Un botón del área de acciones de una diapositiva. */
export interface HeroAction {
    label: string;
    url: string;
    /** `_blank` abre `url` en una pestaña nueva; vacío, en la misma página. */
    target: LinkTarget;
    /** Nombre de un ícono de AtomIcon (ej. `arrow-right`). Vacío = sin ícono. */
    icon: string;
    /** Dónde va el ícono respecto al texto. Solo cuenta si hay `icon`. */
    iconPosition: HeroIconPosition;
}

export type HeroIconPosition = 'start' | 'end';

/**
 * Botones que muestra una diapositiva.
 *
 * Con `secondary` se dibuja SOLO el botón secundario (el de contorno), con los
 * datos de `secondary`. El botón que no se elige no se borra: sigue en el dato
 * y vuelve al cambiar de opción.
 */
export type HeroButtons = 'both' | 'primary' | 'secondary';

const HERO_BUTTONS: readonly HeroButtons[] = ['both', 'primary', 'secondary'];

/**
 * Normaliza la elección de botones.
 *
 * Sin dato (portadas guardadas antes de que existiera la opción) se deduce de
 * lo que ya traían: con secundario escrito, ambos; si no, solo el principal.
 * Es lo que se dibujaba hasta ahora, así que nada cambia al abrirlas.
 */
export const normalizeHeroButtons = (value: unknown, secondary?: HeroAction): HeroButtons => {
    if (HERO_BUTTONS.includes(value as HeroButtons)) return value as HeroButtons;
    return secondary && (secondary.label || secondary.url) ? 'both' : 'primary';
};

/**
 * Cómo se presenta la portada.
 *
 * `single` muestra solo la primera diapositiva, sin flechas ni contador. Las
 * demás se conservan en el dato y reaparecen al volver a `carousel`.
 */
export type HeroMode = 'carousel' | 'single';

/** Ausente cuenta como carrusel: es lo que hacían las portadas ya guardadas. */
export const normalizeHeroMode = (value: unknown): HeroMode =>
    value === 'single' ? 'single' : 'carousel';

/**
 * Una diapositiva de la portada.
 *
 * `desc` y `secondary` son opcionales por diseño (así lo marcan las viñetas de
 * la maqueta: "El texto de descripción es opcional" y "El Button secundario es
 * opcional"). Vacíos, no se dibujan.
 */
export interface HeroSlideItem {
    id: string;
    /** Línea corta sobre el título. */
    eyebrow: string;
    title: string;
    /** Opcional. */
    desc: string;
    image: string;
    imageAlt: string;
    /** Punto focal de la foto, en %. 50 y 50 es el centro (ver helpers/imageFocus.ts). */
    imageFocusX: number;
    imageFocusY: number;
    imageFocusProfiles: ImageFocusProfiles;
    /** Qué botones se dibujan (ver `HeroButtons`). */
    buttons: HeroButtons;
    primary: HeroAction;
    /** Opcional. */
    secondary: HeroAction;
}

export interface HeroSliderData {
    /**
     * Fuente del H1 SEO: texto fijo o uno de los textos de la única diapositiva visible.
     */
    seoHeadingSource: HeroSeoHeadingSource;
    /** Texto del H1 cuando `seoHeadingSource` es `esan` (ESAN por defecto). */
    seoHeadingText: string;
    /** Carrusel o una sola diapositiva (ver `HeroMode`). */
    mode: HeroMode;
    /**
     * Token del color de la franja (ver `normalizeHeroPanelColor`). Se guarda el
     * token y nunca el hexadecimal, como en el resto de bloques con color.
     */
    panelColorToken: string;
    slides: HeroSlideItem[];
}

/**
 * Color de la franja por defecto: el rojo corporativo.
 *
 * `--ds-color-esan-corp` apunta al mismo rojo que `--ds-color-surface-primary`,
 * que es lo que pintaba la franja antes de que fuera configurable. Por eso un
 * bloque guardado sin este campo se ve igual que siempre.
 *
 * No sirve `normalizeBrandColorToken` de la paleta: ante un dato ausente cae en
 * `univ-management` (azul), y las portadas existentes cambiarían de color.
 */
export const DEFAULT_HERO_PANEL_COLOR_TOKEN = '--ds-color-esan-corp';

const HERO_PANEL_COLOR_TOKENS = new Set<string>(
    BRAND_COLOR_GROUPS.flatMap((group) => group.colors.map((color) => color.token)),
);

/** Normaliza el color de la franja: lo desconocido o ausente es el rojo de siempre. */
export const normalizeHeroPanelColor = (value: unknown): string =>
    typeof value === 'string' && HERO_PANEL_COLOR_TOKENS.has(value)
        ? value
        : DEFAULT_HERO_PANEL_COLOR_TOKEN;

/**
 * Variables CSS que reparte el bloque a la hoja (`_hero.scss`).
 *
 * `--hero-panel-content` solo se emite cuando el fondo pide texto oscuro: con
 * un fondo normal la hoja usa su propio blanco (con la transparencia de la
 * descripción) y la portada no cambia ni un píxel respecto a la anterior.
 */
export const heroPanelStyle = (token: unknown): Record<string, string> => {
    const color = normalizeHeroPanelColor(token);
    const style: Record<string, string> = { '--hero-panel-bg': `var(${color})` };

    if (DARK_TEXT_BACKGROUND_TOKENS.has(color)) {
        style['--hero-panel-content'] = 'var(--ds-color-text-primary)';
    }

    return style;
};

/**
 * Intensidad del velo oscuro sobre la foto, en %.
 *
 * 100 es el velo de siempre (el degradado de _hero.scss tal cual) y 0 lo quita
 * del todo: es un factor sobre ese degradado, no un degradado nuevo. Por eso
 * el dato ausente cuenta como 100 y las portadas ya guardadas se ven igual.
 */
export const HERO_OVERLAY_DEFAULT = 100;

/** Normaliza la intensidad del velo: entero entre 0 y 100; lo ausente o inválido, el de siempre. */
export const normalizeHeroOverlay = (value: unknown): number => {
    const n = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : NaN;
    return Number.isFinite(n) ? Math.min(100, Math.max(0, Math.round(n))) : HERO_OVERLAY_DEFAULT;
};

/** Variable CSS con la que la hoja (`_hero.scss`) atenúa el velo: 0 a 1. */
export const heroOverlayStyle = (value: unknown): Record<string, string> => ({
    '--hero-overlay': String(normalizeHeroOverlay(value) / 100),
});

export type HeroSeoHeadingSource = 'esan' | 'title' | 'eyebrow' | 'none';

const HERO_SEO_HEADING_SOURCES: readonly HeroSeoHeadingSource[] = ['esan', 'title', 'eyebrow', 'none'];

/** Old boolean values remain readable: true meant ESAN and false meant no H1. */
export const normalizeHeroSeoHeadingSource = (
    value: unknown,
    legacyShowSeoHeading?: unknown,
): HeroSeoHeadingSource => {
    if (HERO_SEO_HEADING_SOURCES.includes(value as HeroSeoHeadingSource)) {
        return value as HeroSeoHeadingSource;
    }

    return legacyShowSeoHeading === false ? 'none' : 'esan';
};

/** Normaliza una acción, tolerando contenido incompleto. */
export const normalizeHeroAction = (raw: any): HeroAction => ({
    label: typeof raw?.label === 'string' ? raw.label : '',
    url: typeof raw?.url === 'string' ? raw.url : '',
    target: normalizeLinkTarget(raw?.target),
    icon: typeof raw?.icon === 'string' ? raw.icon.trim() : '',
    // Ausente cuenta como "después": así es el botón con flecha del sistema.
    iconPosition: raw?.iconPosition === 'start' ? 'start' : 'end',
});

/** Acción vacía: lo que se entrega a la diapositiva para el botón que no se muestra. */
export const emptyHeroAction = (): HeroAction => ({
    label: '',
    url: '',
    target: '',
    icon: '',
    iconPosition: 'end',
});

/**
 * Los dos botones que llegan a la diapositiva según la elección.
 *
 * El botón descartado va vacío y la diapositiva no dibuja un botón sin texto.
 * Se resuelve aquí y no en HeroSlide para que ella siga recibiendo solo
 * `primary` y `secondary`, sin saber de modos.
 */
export const resolveHeroActions = (
    buttons: HeroButtons,
    primary: HeroAction,
    secondary: HeroAction,
): { primary: HeroAction; secondary: HeroAction } => ({
    primary: buttons === 'secondary' ? emptyHeroAction() : primary,
    secondary: buttons === 'primary' ? emptyHeroAction() : secondary,
});

/** Identificador local para las diapositivas que se agregan desde el editor. */
export const newHeroSlideId = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `hero-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};
