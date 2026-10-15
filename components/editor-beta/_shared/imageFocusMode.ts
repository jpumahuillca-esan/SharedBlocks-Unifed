/**
 * Qué perfil de encuadre (web / tablet / móvil) se está editando en el panel.
 *
 * El lienzo del constructor es un solo ancho, y los bloques eligen su perfil por
 * el ANCHO de su contenedor (`container-down` en _image-focus.scss). Con los
 * paneles abiertos el lienzo suele medir menos de 1024px, así que dibuja el
 * perfil Tablet mientras el panel edita Web por defecto: se movía el encuadre y
 * el lienzo no se enteraba.
 *
 * Con esto el panel le dice al lienzo qué perfil mostrar: el que se está
 * editando. Es estado del editor (no se guarda) y solo existe en el panel de
 * administración: el sitio público no importa este archivo.
 *
 * Varios campos de imagen pueden estar montados a la vez; `owner` evita que uno
 * que se desmonta borre el perfil que acaba de fijar otro.
 */
import { shallowRef } from 'vue';

export type CanvasFocusMode = 'web' | 'tablet' | 'mobile';

const MODES: readonly CanvasFocusMode[] = ['web', 'tablet', 'mobile'];

const state = shallowRef<{ owner: symbol; mode: CanvasFocusMode } | null>(null);

/** Perfil que debe mostrar el lienzo; `null` = el que toque por el ancho (lo normal). */
export const canvasFocusMode = (): CanvasFocusMode | null => state.value?.mode ?? null;

/** Un campo de imagen reclama el perfil que está editando. Lo desconocido se ignora. */
export const claimCanvasFocusMode = (owner: symbol, mode: unknown): void => {
  if (MODES.includes(mode as CanvasFocusMode)) state.value = { owner, mode: mode as CanvasFocusMode };
};

/** Suelta el perfil, pero solo si sigue siendo suyo. */
export const releaseCanvasFocusMode = (owner: symbol): void => {
  if (state.value?.owner === owner) state.value = null;
};
