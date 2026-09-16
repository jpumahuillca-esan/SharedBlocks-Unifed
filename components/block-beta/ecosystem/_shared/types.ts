/**
 * Modelo de datos de la sección de ecosistema académico.
 *
 * Misma idea que en el resto de familias de block-beta: aquí solo vive el dato
 * que el editor guarda y que el bloque reparte. El aspecto lo ponen los átomos
 * y la hoja assets/styles/elements/_ecosystem.scss.
 */

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
    { value: 'mba', label: 'Posgrado (azul noche)', token: '--graduate-mba-100' },
    { value: 'government', label: 'Gobierno (granate)', token: '--goverment-primary-main' },
    { value: 'blue', label: 'Administración (azul)', token: '--univ-blue-100' },
    { value: 'wine', label: 'Economía (vino)', token: '--univ-wine-100' },
    { value: 'green', label: 'Ingeniería (verde)', token: '--univ-green-100' },
    { value: 'yellow', label: 'Derecho (amarillo)', token: '--univ-yellow-100' },
    { value: 'cyan', label: 'Comunicación (turquesa)', token: '--univ-cyan-100' },
    { value: 'orange', label: 'Psicología (naranja)', token: '--univ-orange-100' },
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

/** Una tarjeta, tanto de las dos grandes como de las seis de facultad. */
export interface EcosystemCardItem {
    id: string;
    title: string;
    /** Opcional: vacía, no se dibuja. */
    desc: string;
    image: string;
    imageAlt: string;
    href: string;
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
    bar: EcosystemBarItem;
    /** Las tarjetas de facultad del grupo de la derecha. */
    faculties: EcosystemCardItem[];
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
    href: raw?.href ?? '',
    color: normalizeEcosystemColor(raw?.color),
});
