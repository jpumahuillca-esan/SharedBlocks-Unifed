/**
 * Modelo de datos compartido por las secciones de tarjetas.
 *
 * Misma idea que en los CTA: el encabezado y el número de columnas son comunes,
 * y cada sección añade el tipo de tarjeta que le corresponde.
 */

/** Cuántas tarjetas se muestran en la fila. */
export type CardCount = 2 | 3 | 4;

/** Encabezado común: título a la izquierda, enlace a la derecha. */
export interface CardSectionHeader {
    title: string;
    /** Opcional: línea de apoyo bajo el guion del título. Vacía, no se dibuja. */
    desc: string;
    /** Vacío oculta el enlace. */
    linkLabel: string;
    linkUrl: string;
    /** Cuántas tarjetas se dibujan, recortando la lista si sobran. */
    cardCount: CardCount;
}

/**
 * Tarjeta de evento.
 *
 * La sección usa SIEMPRE el formato con imagen de MoleculeEventCard. El otro
 * formato de la molécula (bloque de fecha a la izquierda, con hora, lugar y
 * botón) queda fuera a propósito: no corresponde al diseño de esta sección, así
 * que ni se ofrece en el editor ni se guarda. La molécula lo sigue soportando
 * para otros usos.
 *
 * Mismo criterio que PostCardItem con el formato de noticia.
 */
export interface EventCardItem {
    id: string;
    /** Fecha en ISO (AAAA-MM-DD), la que elige el calendario del editor. */
    date: string;
    /** Derivados de `date`. Se conservan por si hay contenido antiguo. */
    day: string;
    month: string;
    title: string;
    href: string;
    image: string;
    imageAlt: string;
    /** Etiqueta única, heredada. Se conserva por compatibilidad. */
    tag: string;
    /** Etiquetas, tantas como se quieran. Tienen prioridad sobre `tag`. */
    badges: string[];
}

/**
 * Tarjeta de publicación.
 *
 * La sección usa siempre el formato de noticia de MoleculePostCard: etiquetas
 * sobre la imagen, fecha, título, divisor y enlace. El otro formato de la
 * molécula, con antetítulo y extracto, queda fuera a propósito porque no
 * corresponde a este diseño.
 */
export interface PostCardItem {
    id: string;
    image: string;
    imageAlt: string;
    title: string;
    href: string;
    /** Etiquetas sobre la imagen, tantas como se quieran. */
    badges: string[];
    date: string;
    ctaLabel: string;
}

/**
 * Normaliza el número de columnas ante cualquier valor guardado.
 *
 * Igual que en los CTA: la ausencia no es cero. Un bloque guardado sin el campo
 * cae en 4, que es la disposición por defecto, en lugar de quedarse sin fila.
 */
export const normalizeCardCount = (value: unknown): CardCount => {
    const parsed = Number(value);
    if (parsed === 2) return 2;
    if (parsed === 3) return 3;
    return 4;
};

/** Identificador local para las tarjetas que se agregan desde el editor. */
export const newCardId = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `card-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};
