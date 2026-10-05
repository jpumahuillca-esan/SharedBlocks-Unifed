/**
 * Destino de un enlace: la misma página o una pestaña nueva.
 *
 * Cada enlace que se escribe en el editor lleva, junto a su dirección, un
 * `target` que decide cómo se abre:
 *
 *   ''        "Link interno": se abre en la misma página (el comportamiento normal)
 *   '_blank'  "Página externa": se abre en una pestaña nueva
 *
 * Solo existen esos dos valores a propósito. Lo que no sea exactamente `_blank`
 * cuenta como interno, así un dato antiguo (sin `target`) o con cualquier otro
 * valor sigue abriéndose como siempre.
 *
 * Vive en helpers/ porque lo usan átomos y moléculas, que no pueden depender de
 * la carpeta de un bloque.
 */

export type LinkTarget = '_blank' | '';

export const LINK_TARGET_BLANK: LinkTarget = '_blank';

export const normalizeLinkTarget = (value: unknown): LinkTarget =>
  value === LINK_TARGET_BLANK ? LINK_TARGET_BLANK : '';

/**
 * Atributos HTML de un enlace según su destino. Con `_blank` añade el `rel`
 * que evita que la página abierta reciba acceso a la de origen (`opener`) y que
 * se le envíe el referente; sin él, no añade nada.
 */
export const linkTargetAttrs = (target: unknown): { target?: string; rel?: string } =>
  normalizeLinkTarget(target) === LINK_TARGET_BLANK
    ? { target: LINK_TARGET_BLANK, rel: 'noopener noreferrer' }
    : {};
