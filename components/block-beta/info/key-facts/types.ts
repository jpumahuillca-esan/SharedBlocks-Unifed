/**
 * Datos clave (info/key-facts): lo que comparten el bloque y su editor.
 *
 * Vive junto al bloque y no en una carpeta `_shared/`: es una sola pieza, y
 * lo único que necesitan los dos lados en común es el tope de datos y la forma
 * de cada uno.
 */

/**
 * Máximo de datos en la franja. En el diseño van en una sola fila de cuatro
 * columnas en escritorio y en dos filas de dos en teléfono; con más, ninguna
 * de las dos composiciones se sostiene.
 */
export const KEY_FACTS_MAX_ITEMS = 4;

export interface KeyFactItem {
  id: string;
  /** Rótulo corto sobre el dato ("Duración:"). */
  label: string;
  /** El dato en sí, en negrita ("10 semestres académicos"). */
  value: string;
}
