/**
 * Nombres de ícono sugeridos en los editores de bloques.
 *
 * La fuente de verdad es el mapa ICONS de components/atoms/AtomIcon.vue: acá
 * solo se listan los nombres para poblar las sugerencias de los campos. Un
 * ícono agregado al átomo y no listado acá igual funciona si se escribe a mano,
 * y si AtomIcon no conoce el nombre, no dibuja nada (no rompe el render).
 *
 * Vive en helpers/ y no en la carpeta de un bloque porque lo consumen editores
 * de familias distintas (`cta`, `info`): una lista compartida no puede colgar
 * de un bloque concreto. Mismo criterio que helpers/pictograms.ts, que es su
 * equivalente para los pictogramas de marca.
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
    // Pilares de valor (block-beta/info/values-cards).
    'cpu',
    'leaf',
    'handshake',
    'lightbulb',
    'building-2',
];
