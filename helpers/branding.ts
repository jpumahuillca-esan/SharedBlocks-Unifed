import type { InjectionKey, ComputedRef } from 'vue';

/**
 * Clave de inyección (InjectionKey) para compartir la configuración del Topbar
 * con componentes de cabecera (Header / MegaMenu) que integran los enlaces del topbar
 * en sus menús responsivos móviles.
 */
export const BRANDING_TOPBAR_KEY: InjectionKey<ComputedRef<any>> = Symbol('BRANDING_TOPBAR_KEY');
