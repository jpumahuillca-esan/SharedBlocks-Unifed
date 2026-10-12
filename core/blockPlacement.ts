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
    /** Bloque elegido (o MOBILE_AFTER_START); null = al final. */
    mobileAfterBlockId: string | null;
    setMobileAfter: (blockId: string | null) => void;
}

/** El inspector entrega un `Ref`: cambia con la selección y con cada edición. */
export const BLOCK_PLACEMENT_KEY: InjectionKey<Ref<BlockPlacementContext | null>> = Symbol('block-placement');
