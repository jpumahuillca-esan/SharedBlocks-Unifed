/**
 * Resolución de estilos de sección compartida entre el editor y el sitio público.
 *
 * Vive en la librería compartida a propósito: si el canvas y la web calcularan
 * las dimensiones por separado, lo que el editor muestra dejaría de coincidir
 * con lo publicado en cuanto una de las dos cambiara.
 */

import {
    BOXED_MAX_WIDTH,
    FLOAT_CONTAINER_MAX,
    GRID_UNITS,
    MOBILE_AFTER_START,
    type ColumnPlacement,
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
export const resolveColumnsStyle = (
    settings: SectionSettingsLike = {},
    columns: FloatAwareColumn[] = [],
): StyleMap => {
    const { width = 'full', gapPx = 24, verticalAlign = 'stretch', heightMode = 'auto' } = settings;

    /*
     * Con una columna flotante la grilla la define la hoja sectionLayout.scss,
     * no el estilo en línea: en pantallas chicas es una sola columna, y un
     * estilo en línea no se puede deshacer desde una consulta de medios. Aquí
     * solo quedan los valores que sí son del usuario, como variables.
     */
    const floating = hasFloatingColumn(columns);

    const style: StyleMap = floating
        ? {
            '--ps-gap': px(gapPx),
            '--ps-align': ALIGN_TO_FLEX[verticalAlign] ?? 'stretch',
            // Ancho (de 12) de la flotante: con él las columnas normales saben
            // cuánto hueco reservarle (ver sectionLayout.scss).
            '--ps-float-span': String(floatSpan(columns)),
            // Ancho máximo del contenido en esta sección: el del contenedor al que
            // se alinea el formulario y el que reciben los bloques.
            '--ps-max': px(FLOAT_CONTAINER_MAX),
            // El formulario NO crece con el contenedor: su ancho se calcula sobre
            // el contenedor normal, o a 1600px mediría ~500px.
            '--ps-form-basis': px(BOXED_MAX_WIDTH),
            width: '100%',
            boxSizing: 'border-box',
        }
        : {
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_UNITS}, minmax(0, 1fr))`,
            gap: px(gapPx),
            alignItems: ALIGN_TO_FLEX[verticalAlign] ?? 'stretch',
            width: '100%',
            boxSizing: 'border-box',
        };

    if (width === 'boxed') {
        style.maxWidth = px(floating ? FLOAT_CONTAINER_MAX : BOXED_MAX_WIDTH);
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

/* -------------------------------------------------------------------------- */
/* Columnas flotantes                                                          */
/* -------------------------------------------------------------------------- */

/** Lo mínimo de una columna para saber si flota y a dónde van sus bloques. */
export interface FloatAwareColumn {
    span?: number;
    offsetPx?: number;
    placement?: ColumnPlacement;
    mobileAfterBlockId?: string | null;
    blocks?: Array<{ id: string }>;
}

export const isFloatingColumn = (column: FloatAwareColumn): boolean =>
    column.placement === 'float-end' || column.placement === 'float-start';

export const hasFloatingColumn = (columns: FloatAwareColumn[]): boolean =>
    columns.some(isFloatingColumn);

/** Ancho (de 12) de la columna flotante; si hubiera una por lado, el mayor. */
const floatSpan = (columns: FloatAwareColumn[]): number =>
    Math.min(
        GRID_UNITS,
        Math.max(1, ...columns.filter(isFloatingColumn).map((c) => Math.round(Number(c.span) || 4))),
    );

/**
 * Clases de la grilla de una sección. Vacías si no hay columna flotante: las
 * secciones de siempre no cambian en nada.
 *
 * `ps-columns--reserve-end|start` dicen de qué lado hay que dejar hueco al
 * contenido para que no choque con la flotante.
 */
export const resolveColumnsClass = (
    settings: SectionSettingsLike = {},
    columns: FloatAwareColumn[] = [],
): string[] => {
    if (!hasFloatingColumn(columns)) return [];

    return [
        'ps-columns',
        'ps-columns--float',
        ...(settings.width === 'boxed' ? ['ps-columns--boxed'] : []),
        ...(columns.some((c) => c.placement === 'float-end') ? ['ps-columns--reserve-end'] : []),
        ...(columns.some((c) => c.placement === 'float-start') ? ['ps-columns--reserve-start'] : []),
    ];
};

/**
 * Clases de cada columna; vacías si la sección no tiene columna flotante.
 *
 * `ps-col--full` marca la columna normal que ocupa todo el ancho: es la única
 * que reserva hueco. Con varias normales lado a lado, el cálculo del hueco
 * (que parte del ancho de la sección) no sería cierto para ninguna.
 */
export const resolveColumnClass = (column: FloatAwareColumn, floatingSection: boolean): string[] => {
    if (!floatingSection) return [];
    if (isFloatingColumn(column)) {
        return ['ps-col', 'ps-col--float', column.placement === 'float-start' ? 'ps-col--float-start' : 'ps-col--float-end'];
    }
    return ['ps-col', 'ps-col--flow', ...((column.span ?? 0) >= GRID_UNITS ? ['ps-col--full'] : [])];
};

/**
 * Estilos de todas las columnas de una sección, en el mismo orden.
 *
 * Una sección con columna flotante coloca sus columnas con clases y variables
 * (ver sectionLayout.scss); las demás siguen con `resolveColumnStyle` tal cual.
 * Las columnas normales de una sección con flotante se acomodan una tras otra
 * en la primera fila de la grilla, y la flotante se pone encima.
 */
export const resolveColumnStyles = (
    columns: Array<FloatAwareColumn & { span: number; behavior?: SectionBehavior }>,
    settings: SectionSettingsLike = {},
): StyleMap[] => {
    if (!hasFloatingColumn(columns)) {
        return columns.map((column) => resolveColumnStyle(column, settings));
    }

    let start = 1;

    return columns.map((column) => {
        const span = Math.min(GRID_UNITS, Math.max(1, Math.round(Number(column.span) || GRID_UNITS)));

        if (isFloatingColumn(column)) {
            return {
                '--col-span': String(span),
                '--float-top': px(Number(column.offsetPx) || 0),
                minWidth: '0',
                boxSizing: 'border-box',
            };
        }

        const style: StyleMap = {
            '--col-start': String(start),
            '--col-span': String(span),
            minWidth: '0',
            boxSizing: 'border-box',
        };
        start += span;
        return style;
    });
};

/**
 * Orden visual de cada bloque cuando la sección se apila en una sola columna
 * (móvil), por id de bloque.
 *
 * Los bloques de las columnas normales llevan números pares y los de la columna
 * flotante, el impar que cae justo después del bloque elegido: así el formulario
 * entra en el flujo sin duplicarse en el HTML. Sin elección (o con un bloque que
 * ya no existe) va al final; `MOBILE_AFTER_START`, antes de todo.
 */
export const resolveBlockOrders = (columns: FloatAwareColumn[]): Record<string, number> => {
    const orders: Record<string, number> = {};
    const flow = columns.filter((c) => !isFloatingColumn(c)).flatMap((c) => c.blocks ?? []);

    flow.forEach((block, i) => {
        orders[block.id] = i * 2;
    });

    columns.filter(isFloatingColumn).forEach((column) => {
        const anchor = column.mobileAfterBlockId;
        const anchorIndex = anchor === MOBILE_AFTER_START
            ? -1
            : flow.findIndex((block) => block.id === anchor);
        // Sin ancla válida: debajo del último bloque.
        const rank = anchor === MOBILE_AFTER_START || anchorIndex >= 0 ? anchorIndex : flow.length - 1;

        (column.blocks ?? []).forEach((block) => {
            orders[block.id] = rank * 2 + 1;
        });
    });

    return orders;
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
