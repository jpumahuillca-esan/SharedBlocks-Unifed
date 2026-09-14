/**
 * Resolución de estilos de sección compartida entre el editor y el sitio público.
 *
 * Vive en la librería compartida a propósito: si el canvas y la web calcularan
 * las dimensiones por separado, lo que el editor muestra dejaría de coincidir
 * con lo publicado en cuanto una de las dos cambiara.
 */

import {
    BOXED_MAX_WIDTH,
    GRID_UNITS,
    type SectionBehavior,
    type SectionSettings,
    type SectionVerticalAlign,
} from './sectionTypes';

export { BOXED_MAX_WIDTH, GRID_UNITS };

/** Ajustes parciales: el saneamiento rellena lo que falte. */
export type SectionSettingsLike = Partial<SectionSettings>;

/**
 * Modo de render.
 * - `live`: la web pública. El comportamiento fijo es real.
 * - `editor`: el canvas del administrador. Una sección realmente fija se
 *   escaparía del lienzo y taparía la interfaz, así que se representa anclada
 *   dentro del área de scroll del canvas.
 */
export type SectionRenderMode = 'live' | 'editor';

type StyleMap = Record<string, string>;

const px = (value: number): string => `${value}px`;

const ALIGN_TO_FLEX: Record<SectionVerticalAlign, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
};

/**
 * Estilos del contenedor externo de la sección: alto, fondo, espaciado y
 * comportamiento al hacer scroll.
 */
export const resolveSectionStyle = (
    settings: SectionSettingsLike = {},
    mode: SectionRenderMode = 'live',
): StyleMap => {
    const {
        heightMode = 'auto',
        heightPx = null,
        behavior = 'static',
        offsetPx = 0,
        paddingYPx = 0,
        paddingXPx = 0,
        background = null,
    } = settings;

    const style: StyleMap = {
        width: '100%',
        boxSizing: 'border-box',
    };

    if (paddingYPx) {
        style.paddingTop = px(paddingYPx);
        style.paddingBottom = px(paddingYPx);
    }
    if (paddingXPx) {
        style.paddingLeft = px(paddingXPx);
        style.paddingRight = px(paddingXPx);
    }
    if (background) {
        style.backgroundColor = background;
    }

    // Alto: define el espacio que los bloques deberán rellenar.
    if (heightMode === 'screen') {
        style.minHeight = '100vh';
    } else if (heightMode === 'fixed' && heightPx) {
        style.height = px(heightPx);
        style.overflow = 'hidden';
    }

    // Comportamiento al hacer scroll.
    if (behavior === 'sticky') {
        style.position = 'sticky';
        style.top = px(offsetPx);
        style.zIndex = '20';
    } else if (behavior === 'fixed') {
        // En el editor se ancla al lienzo; en la web se fija a la ventana.
        style.position = mode === 'editor' ? 'sticky' : 'fixed';
        style.top = px(offsetPx);
        style.left = mode === 'editor' ? 'auto' : '0';
        style.right = mode === 'editor' ? 'auto' : '0';
        style.zIndex = '30';
    }

    return style;
};

/**
 * Estilos de la grilla de columnas. Es la grilla la que impone el ancho a cada
 * bloque, que es el corazón del cambio de paradigma.
 */
export const resolveColumnsStyle = (settings: SectionSettingsLike = {}): StyleMap => {
    const { width = 'full', gapPx = 24, verticalAlign = 'stretch', heightMode = 'auto' } = settings;

    const style: StyleMap = {
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_UNITS}, minmax(0, 1fr))`,
        gap: px(gapPx),
        alignItems: ALIGN_TO_FLEX[verticalAlign] ?? 'stretch',
        width: '100%',
        boxSizing: 'border-box',
    };

    if (width === 'boxed') {
        style.maxWidth = px(BOXED_MAX_WIDTH);
        style.marginLeft = 'auto';
        style.marginRight = 'auto';
    }

    // Con alto definido, la grilla ocupa todo el espacio para que los bloques
    // puedan estirarse hasta el borde de la sección.
    if (heightMode !== 'auto') {
        style.height = '100%';
    }

    return style;
};

/** Lo mínimo que hace falta saber de una columna para darle estilo. */
export interface ColumnStyleInput {
    span: number;
    behavior?: SectionBehavior;
    offsetPx?: number;
}

/**
 * Estilos de una columna concreta.
 *
 * Acepta un número suelto por compatibilidad, o la columna completa cuando
 * además tiene comportamiento propio al hacer scroll.
 *
 * Una columna anclada es el patrón de barra lateral fija: se mantiene visible
 * mientras la columna vecina, más alta, sigue desplazándose. A nivel de columna
 * el anclaje siempre es dentro de la sección, nunca sobre la ventana: sacarla
 * del flujo con posición fija le quitaría el ancho que le da la grilla.
 */
export const resolveColumnStyle = (
    column: number | ColumnStyleInput,
    settings: SectionSettingsLike = {},
): StyleMap => {
    const input: ColumnStyleInput = typeof column === 'number' ? { span: column } : column;
    const safeSpan = Math.min(GRID_UNITS, Math.max(1, Math.round(Number(input.span) || GRID_UNITS)));
    const { heightMode = 'auto' } = settings;

    const style: StyleMap = {
        gridColumn: `span ${safeSpan} / span ${safeSpan}`,
        minWidth: '0',
        boxSizing: 'border-box',
    };

    const isPinned = input.behavior === 'sticky' || input.behavior === 'fixed';

    if (isPinned) {
        style.position = 'sticky';
        style.top = px(Number(input.offsetPx) || 0);
        // Sin esto la columna se estira hasta igualar el alto de la fila y deja
        // de tener recorrido, que es justo lo que hace posible el anclaje.
        style.alignSelf = 'start';
        style.zIndex = '10';

        return style;
    }

    if (heightMode !== 'auto') {
        style.height = '100%';
    }

    return style;
};
