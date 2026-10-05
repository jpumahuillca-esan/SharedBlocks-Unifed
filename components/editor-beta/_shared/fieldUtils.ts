/**
 * Utilidades de los campos del panel de edición (editor-beta).
 */

let counter = 0;

/**
 * Id único para enlazar la etiqueta con su control. Un contador de módulo y no
 * `useId()`: ese hook es de Vue 3.5 y el front declara `^3.4`. El panel es una
 * SPA, así que no hay hidratación que obligue a que el id coincida con el
 * servidor.
 */
export const nextFieldId = (prefix = 'ed-field'): string => `${prefix}-${++counter}`;

/**
 * Los atributos de un campo se reparten: `class` y `style` van a la raíz (con
 * ellos el editor pone el margen: `class="mb-2"`) y todo lo demás
 * (`data-edit-target`, `id`, `list`, `aria-*`, los listeners) va al control real.
 *
 * Esto último importa por el enfoque de campos (core/editFocus.ts): si el
 * `data-edit-target` quedara en el contenedor, el panel resaltaría la etiqueta
 * entera y no centraría el campo ni lo enfocaría.
 */
export const controlAttrsOf = (attrs: Record<string, unknown>): Record<string, unknown> => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
};
