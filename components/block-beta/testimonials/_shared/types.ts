/**
 * Modelo de datos de las secciones de historias.
 *
 * Misma idea que en `events` y en los CTA: el encabezado y el número de
 * columnas son comunes, y cada sección añade el tipo de tarjeta que le toca.
 *
 * Aquí NO se define la tarjeta. La tarjeta es MoleculeTestimonial en su forma
 * "video" (components/molecules/MoleculeTestimonial.vue); este archivo solo
 * describe el dato que el editor guarda y que el bloque le pasa.
 *
 * Nombres: la familia es "testimonials" pero el dato habla de "story" porque es
 * lo que el diseño llama "historias". La tarjeta que lo pinta conserva su
 * nombre de sistema, testimonial-card.
 */

/** Cuántas tarjetas se ven a la vez en la fila. */
export type StoryCardCount = 2 | 3 | 4;

/** Encabezado de la sección: texto a la izquierda, enlace a la derecha. */
export interface StorySectionHeaderData {
    title: string;
    /** Línea de apoyo bajo el título. Vacía la oculta. */
    subtitle: string;
    /** Vacío oculta el enlace. */
    linkLabel: string;
    linkUrl: string;
    /** Cuántas tarjetas se ven a la vez; el resto se alcanza deslizando. */
    cardCount: StoryCardCount;
}

/**
 * Una historia.
 *
 * Los nombres de los campos son los del contenido, no los de la molécula
 * (`name` y no `authorName`): el editor lo escribe una persona que carga
 * historias, y el bloque hace la traducción al pasar las props.
 *
 * `videoUrl` es opcional: sin ella la tarjeta es una foto con su enlace y el
 * botón de reproducir queda decorativo, que es el comportamiento del kit.
 */
export interface StoryCardItem {
    id: string;
    /** Nombre de la persona. Va sobre la foto. */
    name: string;
    /** Cargo o programa. */
    role: string;
    image: string;
    imageAlt: string;
    /** YouTube, Vimeo o un archivo de video directo. Vacío = sin video. */
    videoUrl: string;
    /** Destino de "Ver historia". */
    href: string;
    ctaLabel: string;
}

export interface StoriesFeaturedData extends StorySectionHeaderData {
    cards: StoryCardItem[];
}

/**
 * Normaliza el número de columnas ante cualquier valor guardado.
 *
 * Igual que en `events`: la ausencia no es cero. Un bloque guardado sin el
 * campo cae en 4, que es la disposición por defecto, en lugar de quedarse sin
 * fila.
 */
export const normalizeStoryCardCount = (value: unknown): StoryCardCount => {
    const parsed = Number(value);
    if (parsed === 2) return 2;
    if (parsed === 3) return 3;
    return 4;
};

/** Identificador local para las tarjetas que se agregan desde el editor. */
export const newStoryId = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `story-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};
