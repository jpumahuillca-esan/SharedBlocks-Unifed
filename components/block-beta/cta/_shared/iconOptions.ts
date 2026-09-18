/**
 * La lista se mudó a helpers/iconOptions.ts cuando un bloque de otra familia
 * (block-beta/info/values-cards) también necesitó sugerir íconos: una lista que
 * comparten varias familias no puede vivir dentro de la carpeta de una de ellas.
 *
 * Este archivo queda como reenvío para no tocar los editores de CTA que ya la
 * importaban desde aquí. Lo nuevo conviene que importe directamente del helper.
 */
export { ICON_SUGGESTIONS } from '../../../../helpers/iconOptions';
