/**
 * Modelo de datos compartido por los bloques CTA Band.
 *
 * Cada variante del kit tiene su propia arquitectura y se mantiene tal cual:
 * las que traen un área de acciones comparten este contrato de botones, y la
 * compacta conserva su enlace único, que es como está definida en el original.
 */

/** Un botón del área de acciones. */
export interface CtaAction {
    label: string;
    url: string;
}

/** Cuántos botones muestra el área de acciones. Cero la oculta por completo. */
export type CtaButtonCount = 0 | 1 | 2;

/** Parte común de las variantes con encabezado y acciones. */
export interface CtaBandContent {
    eyebrow: string;
    title: string;
    desc: string;
    /**
     * 0 oculta el área de acciones, 1 dibuja solo el principal y 2 agrega el
     * secundario. Los textos se conservan al cambiar de opción.
     */
    buttonCount: CtaButtonCount;
    primary: CtaAction;
    secondary: CtaAction;
}

/** Variantes con imagen de fondo: a la izquierda y a sangre. */
export interface CtaBandImageData extends CtaBandContent {
    image: string;
    imageAlt: string;
}

/** Variante sólida de marca: solo color e información. */
export type CtaBandSolidData = CtaBandContent;

/**
 * Variante compacta.
 *
 * No comparte el contrato de botones: en el kit lleva un único enlace con
 * flecha, no un área de acciones. Se respeta esa arquitectura.
 */
export interface CtaBandCompactData {
    icon: string;
    title: string;
    desc: string;
    linkLabel: string;
    linkUrl: string;
}

/**
 * Normaliza el número de botones ante cualquier valor guardado.
 * Ante un valor irreconocible cae en 1, que es el caso más común.
 */
export const normalizeButtonCount = (value: unknown): CtaButtonCount => {
    /*
     * Ausencia no es cero. `Number(null)` y `Number('')` dan 0, así que sin
     * este guardia un bloque guardado sin el campo se quedaría sin botones en
     * silencio en lugar de caer en el caso habitual.
     */
    if (value === null || value === undefined || value === '') return 1;

    const parsed = Number(value);
    if (parsed === 0) return 0;
    if (parsed === 2) return 2;
    return 1;
};

/** Normaliza una acción, tolerando contenido incompleto. */
export const normalizeAction = (raw: any, fallbackLabel = ''): CtaAction => ({
    label: typeof raw?.label === 'string' ? raw.label : fallbackLabel,
    url: typeof raw?.url === 'string' ? raw.url : '',
});
