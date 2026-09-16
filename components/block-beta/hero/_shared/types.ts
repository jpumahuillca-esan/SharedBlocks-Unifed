/**
 * Modelo de datos del carrusel de portada.
 *
 * Misma idea que en el resto de familias de block-beta: aquí solo vive el dato
 * que el editor guarda y que el bloque reparte. El aspecto lo ponen los átomos
 * y la hoja assets/styles/elements/_hero.scss.
 */

/** Un botón del área de acciones de una diapositiva. */
export interface HeroAction {
    label: string;
    url: string;
}

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
    primary: HeroAction;
    /** Opcional. */
    secondary: HeroAction;
}

export interface HeroSliderData {
    /**
     * Si el bloque emite el <h1> oculto "ESAN" para buscadores.
     *
     * Configurable porque el hero se reutiliza en varias páginas y cada página
     * debe tener un único título principal: donde la página ya tenga su propio
     * <h1>, o donde "ESAN" no la describa, se desactiva.
     */
    showSeoHeading: boolean;
    slides: HeroSlideItem[];
}

/**
 * Normaliza la opción del título para buscadores.
 *
 * Ausente cuenta como activado, no como desactivado: los bloques guardados antes
 * de que existiera la opción ya emitían el <h1>, y no deben perderlo en silencio
 * por no tener el campo.
 */
export const normalizeShowSeoHeading = (value: unknown): boolean => value !== false;

/** Normaliza una acción, tolerando contenido incompleto. */
export const normalizeHeroAction = (raw: any): HeroAction => ({
    label: typeof raw?.label === 'string' ? raw.label : '',
    url: typeof raw?.url === 'string' ? raw.url : '',
});

/** Identificador local para las diapositivas que se agregan desde el editor. */
export const newHeroSlideId = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `hero-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};
