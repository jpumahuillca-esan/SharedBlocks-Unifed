/**
 * Modelo de datos de la sección de ecosistema académico.
 *
 * Misma idea que en el resto de familias de block-beta: aquí solo vive el dato
 * que el editor guarda y que el bloque reparte. El aspecto lo ponen los átomos
 * y la hoja assets/styles/elements/_ecosystem.scss.
 */
import { normalizeImageFocus } from '../../../../helpers/imageFocus';
import { normalizeLinkTarget, type LinkTarget } from '../../../../helpers/linkTarget';

/**
 * Colores de tarjeta.
 *
 * NO son colores libres: cada uno apunta a un token que ya existe en
 * tokens.scss. Los seis de facultad son literalmente la sección "University
 * faculties" de ese archivo, que tiene exactamente seis entradas para las seis
 * escuelas de la maqueta; los otros dos son los de posgrado y gobierno.
 *
 * Se guarda el nombre y no el color: si mañana la marca corrige un tono, cambia
 * en tokens.scss y las páginas ya publicadas lo siguen solas. Guardar el hex
 * dejaría el valor viejo congelado en la base de datos.
 */
export type EcosystemColor =
    | 'mba'
    | 'government'
    | 'blue'
    | 'wine'
    | 'green'
    | 'yellow'
    | 'cyan'
    | 'orange';

/** Opciones tal como se ofrecen en el editor, con el token que usa cada una. */
export const ECOSYSTEM_COLORS: Array<{ value: EcosystemColor; label: string; token: string }> = [
    { value: 'mba', label: 'Posgrado (azul noche)', token: '--ds-color-gsb-mba-primary' },
    { value: 'government', label: 'Gobierno (granate)', token: '--ds-color-government' },
    { value: 'blue', label: 'Administración (azul)', token: '--ds-color-univ-management' },
    { value: 'wine', label: 'Economía (vino)', token: '--ds-color-univ-economics' },
    { value: 'green', label: 'Ingeniería (verde)', token: '--ds-color-univ-engineering' },
    { value: 'yellow', label: 'Derecho (amarillo)', token: '--ds-color-univ-law' },
    { value: 'cyan', label: 'Comunicación (turquesa)', token: '--ds-color-univ-communications' },
    { value: 'orange', label: 'Psicología (naranja)', token: '--ds-color-univ-psychology' },
];

const COLOR_VALUES = new Set(ECOSYSTEM_COLORS.map((option) => option.value));

/**
 * Normaliza el color ante cualquier valor guardado.
 *
 * Ante un nombre irreconocible cae en 'blue' en lugar de quedarse sin color, que
 * dejaría la tarjeta con el panel transparente y el texto blanco ilegible.
 */
export const normalizeEcosystemColor = (value: unknown): EcosystemColor =>
    typeof value === 'string' && COLOR_VALUES.has(value as EcosystemColor)
        ? (value as EcosystemColor)
        : 'blue';

/**
 * Etiqueta del título de las tarjetas: h2, h3 o h4.
 *
 * Solo decide la jerarquía del documento, no el tamaño, que lo fija la
 * variante de tarjeta. Se elige por grupo y no por tarjeta: mezclar niveles
 * dentro de un mismo grupo rompe el índice de títulos de la página. El h1 no
 * se ofrece porque es el título de la página.
 */
export type EcosystemTitleLevel = 2 | 3 | 4;

export const ECOSYSTEM_TITLE_LEVELS: EcosystemTitleLevel[] = [2, 3, 4];

/**
 * Por defecto las escuelas son h2 y las facultades h3: las facultades cuelgan
 * de la franja "ESAN University", que ya es un h2.
 */
export const DEFAULT_FEATURES_TITLE_LEVEL: EcosystemTitleLevel = 2;
export const DEFAULT_FACULTIES_TITLE_LEVEL: EcosystemTitleLevel = 3;

/**
 * Normaliza el nivel ante cualquier valor guardado. Las páginas creadas antes
 * de que existiera el campo no lo traen y caen en el valor por defecto.
 */
export const normalizeEcosystemTitleLevel = (
    value: unknown,
    fallback: EcosystemTitleLevel,
): EcosystemTitleLevel => {
    const level = Number(value);
    return ECOSYSTEM_TITLE_LEVELS.includes(level as EcosystemTitleLevel)
        ? (level as EcosystemTitleLevel)
        : fallback;
};

/** Una tarjeta, tanto de las dos grandes como de las seis de facultad. */
export interface EcosystemCardItem {
    id: string;
    title: string;
    /** Opcional: vacía, no se dibuja. */
    desc: string;
    image: string;
    imageAlt: string;
    /** Punto focal de la foto, en %. 50 y 50 es el centro (ver helpers/imageFocus.ts). */
    imageFocusX: number;
    imageFocusY: number;
    href: string;
    /** `_blank` abre `href` en una pestaña nueva; vacío, en la misma página. */
    target: LinkTarget;
    color: EcosystemColor;
}

/** Franja de encabezado del grupo de facultades. */
export interface EcosystemBarItem {
    title: string;
    desc: string;
    href: string;
}

export interface SectionEcosystemData {
    title: string;
    desc: string;
    /** Las dos tarjetas grandes de la columna izquierda. */
    features: EcosystemCardItem[];
    /** Etiqueta del título de las escuelas. Por defecto, h2. */
    featuresTitleLevel: EcosystemTitleLevel;
    bar: EcosystemBarItem;
    /** Las tarjetas de facultad del grupo de la derecha. */
    faculties: EcosystemCardItem[];
    /** Etiqueta del título de las facultades. Por defecto, h3. */
    facultiesTitleLevel: EcosystemTitleLevel;
}

/** Identificador local para las tarjetas que se agregan desde el editor. */
export const newEcosystemCardId = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `eco-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

/** Normaliza una tarjeta, tolerando contenido incompleto. */
export const normalizeEcosystemCard = (raw: any, index = 0): EcosystemCardItem => ({
    id: raw?.id || `eco-${index}`,
    title: raw?.title ?? '',
    desc: raw?.desc ?? '',
    image: raw?.image ?? '',
    imageAlt: raw?.imageAlt ?? '',
    imageFocusX: normalizeImageFocus(raw?.imageFocusX),
    imageFocusY: normalizeImageFocus(raw?.imageFocusY),
    href: raw?.href ?? '',
    target: normalizeLinkTarget(raw?.target),
    color: normalizeEcosystemColor(raw?.color),
});
