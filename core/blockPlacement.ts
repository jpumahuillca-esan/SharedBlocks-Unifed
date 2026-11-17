/**
 * Dónde está colocado el bloque que se edita, para los editores que lo necesitan.
 *
 * Un bloque dentro de una columna FLOTANTE (ver ColumnPlacement en
 * sectionTypes.ts) se ve en escritorio flotando sobre el resto de la sección y,
 * en móvil, entra en el flujo como un bloque más. En qué punto del flujo es una
 * decisión de quien edita el bloque, así que el inspector se la ofrece al editor
 * del bloque por inyección: igual que core/editFocus.ts, para no añadir props a
 * todos los editores registrados. Sin inspector (o con un bloque que no flota)
 * no hay contexto y el editor no muestra nada.
 */
import type { InjectionKey, Ref } from 'vue';
import { MOBILE_AFTER_END, MOBILE_AFTER_START, type ColumnPlacement } from './sectionTypes';

/** Un bloque de la sección bajo el cual puede colocarse el flotante en móvil. */
export interface PlacementAnchor {
    id: string;
    label: string;
}

export interface BlockPlacementContext {
    /** De qué lado flota en escritorio. */
    side: 'end' | 'start';
    /** Bloques normales de la sección, en el orden en que se leen. */
    anchors: PlacementAnchor[];
    /** Bloque elegido (MOBILE_AFTER_START, MOBILE_AFTER_END o id); null = automático según lado. */
    mobileAfterBlockId: string | null;
    setMobileAfter: (blockId: string | null) => void;
}

/** Construye la lista ordenada de bloques normales debajo de los cuales se puede insertar el flotante. */
export const resolveFloatingAnchors = (
    columns: ReadonlyArray<{
        placement?: ColumnPlacement;
        blocks?: Array<{ id: string; type: string; content?: Record<string, any> }>;
    }>,
    labels: Record<string, string> = {},
): PlacementAnchor[] =>
    columns
        .filter((c) => (c.placement ?? 'flow') === 'flow')
        .flatMap((c) => c.blocks ?? [])
        .map((b, i) => {
            const rawTitle = b.content?.title ?? b.content?.mainTitle;
            const title = typeof rawTitle === 'string' ? rawTitle.trim() : '';
            const label = labels[b.type] || b.type;
            return { id: b.id, label: `${i + 1}. ${label}${title ? ` — ${title}` : ''}` };
        });

/**
 * Resuelve el valor efectivo para el selector del editor: si es nulo o el bloque
 * ya no existe, usa la posición natural del lado donde flota (`start` al inicio,
 * `end` al final).
 */
export const resolveEffectiveMobileAfter = (
    side: 'end' | 'start',
    mobileAfterBlockId: string | null | undefined,
    anchors: ReadonlyArray<PlacementAnchor>,
): string => {
    if (mobileAfterBlockId === MOBILE_AFTER_START || mobileAfterBlockId === MOBILE_AFTER_END) {
        return mobileAfterBlockId;
    }
    if (mobileAfterBlockId && anchors.some((a) => a.id === mobileAfterBlockId)) {
        return mobileAfterBlockId;
    }
    return side === 'start' ? MOBILE_AFTER_START : MOBILE_AFTER_END;
};

/** El inspector entrega un `Ref`: cambia con la selección y con cada edición. */
export const BLOCK_PLACEMENT_KEY: InjectionKey<Ref<BlockPlacementContext | null>> = Symbol('block-placement');
