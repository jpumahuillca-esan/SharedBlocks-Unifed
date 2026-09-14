/**
 * Nombres de ícono sugeridos en los editores de CTA.
 *
 * La fuente de verdad es el mapa ICONS de components/atoms/AtomIcon.vue: acá
 * solo se listan los nombres para poblar las sugerencias del campo. El campo
 * acepta cualquier valor, así que un ícono agregado al átomo y no listado acá
 * igual funciona si se escribe a mano.
 *
 * Si AtomIcon no conoce el nombre, no dibuja nada (no rompe el render).
 */
export const ICON_SUGGESTIONS: string[] = [
    // Los que usa el CTA Band original de webunificada.
    'help-circle',
    'arrow-right',
    // Resto del set disponible en AtomIcon.
    'graduation-cap',
    'book-open',
    'briefcase',
    'award',
    'users',
    'globe',
    'calendar',
    'clock',
    'map-pin',
    'phone',
    'mail',
    'search',
    'check',
    'check-circle',
    'star',
    'download',
    'external-link',
    'play',
    'info',
    'alert-triangle',
    'alert-circle',
    'link',
    'layout-grid',
    'list',
    'user',
    'file-text',
    'credit-card',
    'file-down',
    'trending-up',
];
