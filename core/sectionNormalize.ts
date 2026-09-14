/**
 * Normalización del contenido persistido al modelo de secciones.
 *
 * Frontera de compatibilidad compartida: todo lo que sale de la base de datos
 * pasa por aquí, tanto en el editor como en el sitio público. Así una página
 * guardada con el formato heredado (lista plana de bloques) se sigue viendo
 * igual después de la migración, sin necesidad de reescribir los registros.
 */

import { BLOCK_REGISTRY } from './BlockRegistry';
import {
    DEFAULT_SECTION_SETTINGS,
    GRID_UNITS,
    type BlockItem,
    type SectionBehavior,
    type SectionColumn,
    type SectionHeightMode,
    type SectionItem,
    type SectionSettings,
    type SectionVerticalAlign,
    type SectionWidth,
} from './sectionTypes';

/** Genera identificadores únicos con respaldo para entornos sin crypto.randomUUID. */
export const createId = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

export const clampSpan = (span: unknown): number => {
    const parsed = Number(span);
    if (!Number.isFinite(parsed)) return GRID_UNITS;
    return Math.min(GRID_UNITS, Math.max(1, Math.round(parsed)));
};

export const createColumn = (span: number = GRID_UNITS, blocks: BlockItem[] = []): SectionColumn => ({
    id: createId(),
    span: clampSpan(span),
    blocks,
    // Explícito a propósito: así una columna recién creada y una leída de la
    // base tienen exactamente la misma forma.
    behavior: 'static',
    offsetPx: 0,
});

export const createSection = (
    spans: number[] = [GRID_UNITS],
    settings: Partial<SectionSettings> = {},
): SectionItem => ({
    id: createId(),
    columns: (spans.length ? spans : [GRID_UNITS]).map((span) => createColumn(span)),
    settings: { ...DEFAULT_SECTION_SETTINGS, ...settings },
});

/* -------------------------------------------------------------------------- */
/* Detección de formato                                                        */
/* -------------------------------------------------------------------------- */

const isRecord = (value: unknown): value is Record<string, any> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

/** Una sección del modelo nuevo siempre trae el arreglo `columns`. */
export const looksLikeSection = (value: unknown): boolean =>
    isRecord(value) && Array.isArray(value.columns);

/** Un bloque heredado trae `type` y no trae `columns`. */
export const looksLikeLegacyBlock = (value: unknown): boolean =>
    isRecord(value) && typeof value.type === 'string' && !Array.isArray(value.columns);

/** ¿El contenido guardado sigue en el formato plano anterior? */
export const isLegacyContent = (raw: unknown): boolean =>
    Array.isArray(raw) && raw.length > 0 && raw.every((item) => looksLikeLegacyBlock(item));

/* -------------------------------------------------------------------------- */
/* Saneamiento                                                                 */
/* -------------------------------------------------------------------------- */

const ALLOWED_WIDTHS: SectionWidth[] = ['full', 'boxed'];
const ALLOWED_HEIGHT_MODES: SectionHeightMode[] = ['auto', 'fixed', 'screen'];
const ALLOWED_BEHAVIORS: SectionBehavior[] = ['static', 'sticky', 'fixed'];
const ALLOWED_ALIGNS: SectionVerticalAlign[] = ['start', 'center', 'end', 'stretch'];

const pickEnum = <T extends string>(value: unknown, allowed: T[], fallback: T): T =>
    allowed.includes(value as T) ? (value as T) : fallback;

const pickNumber = (value: unknown, fallback: number, min = 0, max = 10000): number => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
};

export const sanitizeSettings = (raw: unknown): SectionSettings => {
    const input = isRecord(raw) ? raw : {};
    const heightMode = pickEnum(input.heightMode, ALLOWED_HEIGHT_MODES, DEFAULT_SECTION_SETTINGS.heightMode);

    return {
        width: pickEnum(input.width, ALLOWED_WIDTHS, DEFAULT_SECTION_SETTINGS.width),
        heightMode,
        // El alto en píxeles solo tiene sentido en modo 'fixed'.
        heightPx: heightMode === 'fixed' ? pickNumber(input.heightPx, 400, 40, 5000) : null,
        behavior: pickEnum(input.behavior, ALLOWED_BEHAVIORS, DEFAULT_SECTION_SETTINGS.behavior),
        offsetPx: pickNumber(input.offsetPx, DEFAULT_SECTION_SETTINGS.offsetPx, 0, 2000),
        verticalAlign: pickEnum(input.verticalAlign, ALLOWED_ALIGNS, DEFAULT_SECTION_SETTINGS.verticalAlign),
        gapPx: pickNumber(input.gapPx, DEFAULT_SECTION_SETTINGS.gapPx, 0, 200),
        paddingYPx: pickNumber(input.paddingYPx, DEFAULT_SECTION_SETTINGS.paddingYPx, 0, 400),
        paddingXPx: pickNumber(input.paddingXPx, DEFAULT_SECTION_SETTINGS.paddingXPx, 0, 400),
        background: typeof input.background === 'string' && input.background.trim() ? input.background : null,
    };
};

const sanitizeBlock = (raw: unknown): BlockItem | null => {
    if (!isRecord(raw) || typeof raw.type !== 'string' || !raw.type) return null;

    return {
        id: typeof raw.id === 'string' && raw.id ? raw.id : createId(),
        type: raw.type,
        content: isRecord(raw.content) ? raw.content : {},
    };
};

const sanitizeColumn = (raw: unknown): SectionColumn => {
    const input = isRecord(raw) ? raw : {};
    const blocks = Array.isArray(input.blocks)
        ? input.blocks.map(sanitizeBlock).filter((b): b is BlockItem => b !== null)
        : [];

    const behavior = pickEnum(input.behavior, ALLOWED_BEHAVIORS, 'static');

    return {
        id: typeof input.id === 'string' && input.id ? input.id : createId(),
        span: clampSpan(input.span),
        blocks,
        behavior,
        // El desplazamiento solo tiene sentido si la columna está anclada.
        offsetPx: behavior === 'static' ? 0 : pickNumber(input.offsetPx, 0, 0, 2000),
    };
};

const sanitizeSection = (raw: unknown): SectionItem => {
    const input = isRecord(raw) ? raw : {};
    const rawColumns = Array.isArray(input.columns) ? input.columns.map(sanitizeColumn) : [];

    // Una sección sin columnas quedaría inservible: garantizamos al menos una.
    const columns = rawColumns.length ? rawColumns : [createColumn()];
    const settings = sanitizeSettings(input.settings);

    /*
     * Invariante del modelo: con más de una columna el anclaje se decide
     * columna por columna. Un anclaje de sección convivía mal con eso, porque
     * mover una mitad arrastraba a la otra. Se normaliza aquí, en el único
     * punto por donde entran los datos guardados.
     */
    if (columns.length > 1 && settings.behavior !== 'static') {
        settings.behavior = 'static';
        settings.offsetPx = 0;
    }

    return {
        id: typeof input.id === 'string' && input.id ? input.id : createId(),
        ...(typeof input.label === 'string' && input.label ? { label: input.label } : {}),
        columns,
        settings,
    };
};

/**
 * Envuelve un bloque heredado en su propia sección de una columna.
 * Conserva el aspecto previo leyendo `isBoxed` del registro de bloques, que era
 * lo que antes decidía si el bloque se veía centrado o a todo el ancho.
 */
const wrapLegacyBlock = (block: BlockItem): SectionItem => {
    const isBoxed = Boolean(BLOCK_REGISTRY[block.type]?.isBoxed);

    return {
        id: createId(),
        columns: [createColumn(GRID_UNITS, [block])],
        settings: {
            ...DEFAULT_SECTION_SETTINGS,
            width: isBoxed ? 'boxed' : 'full',
        },
    };
};

/**
 * Convierte cualquier contenido persistido al modelo de secciones.
 *
 * Acepta el formato nuevo, el heredado plano y listas mixtas (por ejemplo una
 * plantilla antigua insertada en una página ya migrada). Nunca lanza: ante
 * datos corruptos descarta el elemento en lugar de romper la página completa.
 */
export const normalizeToSections = (raw: unknown): SectionItem[] => {
    if (!Array.isArray(raw)) return [];

    const sections: SectionItem[] = [];

    for (const item of raw) {
        if (looksLikeSection(item)) {
            sections.push(sanitizeSection(item));
            continue;
        }

        if (looksLikeLegacyBlock(item)) {
            const block = sanitizeBlock(item);
            if (block) sections.push(wrapLegacyBlock(block));
            continue;
        }
        // Elemento irreconocible: se ignora en lugar de tumbar la página.
    }

    return sections;
};

/* -------------------------------------------------------------------------- */
/* Consultas                                                                   */
/* -------------------------------------------------------------------------- */

/** Todos los bloques en orden de lectura, sin la envoltura de secciones. */
export const flattenBlocks = (sections: SectionItem[]): BlockItem[] =>
    sections.flatMap((section) => section.columns.flatMap((column) => column.blocks));

export const countBlocks = (section: SectionItem): number =>
    section.columns.reduce((total, column) => total + column.blocks.length, 0);

export const isSectionEmpty = (section: SectionItem): boolean => countBlocks(section) === 0;

/** Busca un bloque por id devolviendo también dónde vive. */
export const findBlock = (
    sections: SectionItem[],
    blockId: string,
): { block: BlockItem; sectionId: string; columnId: string; index: number } | null => {
    for (const section of sections) {
        for (const column of section.columns) {
            const index = column.blocks.findIndex((b) => b.id === blockId);
            if (index !== -1) {
                return { block: column.blocks[index], sectionId: section.id, columnId: column.id, index };
            }
        }
    }
    return null;
};
