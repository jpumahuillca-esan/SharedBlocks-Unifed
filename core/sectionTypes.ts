/**
 * Definición canónica del modelo de secciones.
 *
 * Es la única fuente de verdad de la forma de los datos. La consumen el
 * administrador (canvas) y el sitio público, de modo que si la estructura
 * cambia, ambos lo ven a la vez en tiempo de compilación.
 */

export interface BlockItem {
    id: string;
    type: string;
    content: Record<string, any>;
}

/** Ancho del contenedor: a todo el ancho de la ventana o centrado con tope. */
export type SectionWidth = 'full' | 'boxed';

/** Cómo se calcula el alto de la sección. */
export type SectionHeightMode = 'auto' | 'fixed' | 'screen';

/** Comportamiento de la sección al hacer scroll. */
export type SectionBehavior = 'static' | 'sticky' | 'fixed';

/** Alineación vertical del contenido dentro de la sección. */
export type SectionVerticalAlign = 'start' | 'center' | 'end' | 'stretch';

/**
 * Cómo se coloca una columna dentro de la sección.
 *
 * - `flow`: ocupa su tramo de la grilla, como siempre.
 * - `float-end` / `float-start`: sale de la grilla y flota SOBRE el contenido de
 *   las demás columnas, pegada al lado derecho o izquierdo, y acompaña al scroll
 *   mientras dure la sección. Es el patrón del formulario sobre el hero: el
 *   contenido llega a todo el ancho y el formulario queda flotando encima.
 *   Flota desde 1280px; por debajo (tableta y móvil) la columna entra en el
 *   flujo (ver `mobileAfterBlockId`).
 */
export type ColumnPlacement = 'flow' | 'float-end' | 'float-start';

/** Valor de `mobileAfterBlockId` para colocar la columna flotante antes de todo. */
export const MOBILE_AFTER_START = '__start__';

export interface SectionColumn {
    id: string;
    /**
     * Porción de la grilla de 12 que ocupa esta columna. En una columna
     * flotante es su ancho (de 12), no un tramo de la grilla.
     */
    span: number;
    blocks: BlockItem[];
    /** Por defecto `flow`. Una columna flotante siempre va anclada (sticky). */
    placement?: ColumnPlacement;
    /**
     * Solo para columnas flotantes: en móvil sus bloques pasan a ser un bloque
     * más y se colocan DEBAJO del bloque con este id (de las columnas normales
     * de la misma sección). `MOBILE_AFTER_START` los pone antes de todo; vacío o
     * un id que ya no existe, al final.
     */
    mobileAfterBlockId?: string | null;
    /**
     * Comportamiento propio de la columna al hacer scroll.
     *
     * Permite el patrón de barra lateral fija: una columna se queda anclada
     * mientras la columna vecina, más alta, sigue desplazándose. El efecto solo
     * existe si la sección es más alta que esta columna, porque ese sobrante es
     * el recorrido durante el cual permanece anclada.
     */
    behavior?: SectionBehavior;
    /** Distancia al borde superior cuando la columna es sticky o fixed. */
    offsetPx?: number;
}

export interface SectionSettings {
    width: SectionWidth;
    heightMode: SectionHeightMode;
    /** Alto en píxeles. Solo aplica cuando heightMode es 'fixed'. */
    heightPx: number | null;
    behavior: SectionBehavior;
    /** Distancia al borde superior cuando la sección es sticky o fixed. */
    offsetPx: number;
    verticalAlign: SectionVerticalAlign;
    /** Separación horizontal entre columnas. */
    gapPx: number;
    paddingYPx: number;
    paddingXPx: number;
    /** Color de fondo CSS. null = transparente. */
    background: string | null;
}

export interface SectionItem {
    id: string;
    /** Nombre opcional para identificar la sección en el árbol del editor. */
    label?: string;
    columns: SectionColumn[];
    settings: SectionSettings;
}

/** Total de unidades de la grilla horizontal. */
export const GRID_UNITS = 12;

/** Ancho máximo del contenido centrado. */
export const BOXED_MAX_WIDTH = 1280;

/**
 * Ancho mínimo (px) de una columna flotante. El contenedor de la sección sigue
 * siendo el de siempre (BOXED_MAX_WIDTH, 1280px): la flotante toma ese ancho
 * mínimo —o más, si su proporción de 12 da más— y los bloques del costado se
 * quedan con el resto. Con menos de 400px el formulario no deja leer sus campos.
 */
export const FLOAT_MIN_WIDTH = 400;

export const DEFAULT_SECTION_SETTINGS: SectionSettings = {
    width: 'full',
    heightMode: 'auto',
    heightPx: null,
    behavior: 'static',
    offsetPx: 0,
    verticalAlign: 'stretch',
    gapPx: 24,
    paddingYPx: 0,
    paddingXPx: 0,
    background: null,
};
