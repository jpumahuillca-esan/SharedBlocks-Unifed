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

export interface SectionColumn {
    id: string;
    /** Porción de la grilla de 12 que ocupa esta columna. */
    span: number;
    blocks: BlockItem[];
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
export const BOXED_MAX_WIDTH = 1100;

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
