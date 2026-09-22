import type { ComputedRef, InjectionKey } from 'vue';

/**
 * Configuración del topbar de branding, para las piezas que la necesitan sin
 * ser el topbar.
 *
 * Caso de uso: en móvil los enlaces institucionales del topbar se ocultan
 * (ver _topbar-v1.scss) y pasan al menú hamburguesa de la cabecera
 * (headers/mega_menu_beta). La cabecera no recibe esa configuración por props:
 * quien la pinta —el layout de public-site y el lienzo del admin— la provee con
 * esta clave, y la cabecera la inyecta. Así las cabeceras que no la usan no
 * reciben un atributo que no conocen.
 *
 * Vale `null` cuando la unidad no tiene topbar.
 */
export const BRANDING_TOPBAR_KEY: InjectionKey<ComputedRef<Record<string, any> | null>> =
  Symbol('branding-topbar');