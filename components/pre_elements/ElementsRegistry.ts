import { defineAsyncComponent } from 'vue';

/**
 * ElementsRegistry — catálogo de "Elementos" (ARCIS Design System,
 * sección Elementos de webunificada/ui-kit.html) ya construidos en esta
 * librería, con un componente de vista previa que muestra todas sus
 * variantes juntas.
 *
 * Es el equivalente de BlockRegistry.ts pero para elementos que NO son
 * bloques insertables en una página — no tienen editor, no tienen
 * initialData, no se agregan al lienzo. Solo sirven para previsualizarse
 * (ver ElementsRegistry usado en el sidebar del editor, pestaña
 * "Elementos": hover para ver, sin poder agregarlos).
 *
 * Catálogo completo: las 26 secciones de Elementos que documenta
 * webunificada/ui-kit.html quedaron portadas acá, de Botones a Marquee.
 */
export const ELEMENTS_REGISTRY: Record<string, {
  label: string;
  icon: string;
  component: ReturnType<typeof defineAsyncComponent>;
}> = {
  Buttons: {
    label: 'Botones',
    icon: 'square',
    component: defineAsyncComponent(() => import('./PreviewButtons.vue')),
  },
  Badges: {
    label: 'Badges & Eyebrow',
    icon: 'tag',
    component: defineAsyncComponent(() => import('./PreviewBadges.vue')),
  },
  Cards: {
    label: 'Cards',
    icon: 'credit-card',
    component: defineAsyncComponent(() => import('./PreviewCards.vue')),
  },
  SocialIcons: {
    label: 'Iconos Sociales',
    icon: 'share-2',
    component: defineAsyncComponent(() => import('./PreviewSocialIcons.vue')),
  },
  Forms: {
    label: 'Formularios',
    icon: 'clipboard-list',
    component: defineAsyncComponent(() => import('./PreviewForms.vue')),
  },
  Alerts: {
    label: 'Alerts',
    icon: 'alert-circle',
    component: defineAsyncComponent(() => import('./PreviewAlerts.vue')),
  },
  Dividers: {
    label: 'Dividers',
    icon: 'minus',
    component: defineAsyncComponent(() => import('./PreviewDividers.vue')),
  },
  Steppers: {
    label: 'Steppers',
    icon: 'list-ordered',
    component: defineAsyncComponent(() => import('./PreviewSteppers.vue')),
  },
  Avatars: {
    label: 'Avatars',
    icon: 'user-circle',
    component: defineAsyncComponent(() => import('./PreviewAvatars.vue')),
  },
  Chips: {
    label: 'Chips / Tags',
    icon: 'tags',
    component: defineAsyncComponent(() => import('./PreviewChips.vue')),
  },
  Tooltips: {
    label: 'Tooltips',
    icon: 'message-circle',
    component: defineAsyncComponent(() => import('./PreviewTooltips.vue')),
  },
  Loaders: {
    label: 'Loaders / Spinners',
    icon: 'loader',
    component: defineAsyncComponent(() => import('./PreviewLoaders.vue')),
  },
  Progress: {
    label: 'Progress bars',
    icon: 'bar-chart-2',
    component: defineAsyncComponent(() => import('./PreviewProgress.vue')),
  },
  ScrollTop: {
    label: 'Scroll top',
    icon: 'arrow-up-circle',
    component: defineAsyncComponent(() => import('./PreviewScrollTop.vue')),
  },
  Pagination: {
    label: 'Pagination',
    icon: 'chevrons-right',
    component: defineAsyncComponent(() => import('./PreviewPagination.vue')),
  },
  CookieBanner: {
    label: 'Cookie Banner',
    icon: 'cookie',
    component: defineAsyncComponent(() => import('./PreviewCookieBanner.vue')),
  },
  Breadcrumb: {
    label: 'Breadcrumb',
    icon: 'chevrons-right',
    component: defineAsyncComponent(() => import('./PreviewBreadcrumb.vue')),
  },
  ButtonGroup: {
    label: 'Button Group',
    icon: 'columns',
    component: defineAsyncComponent(() => import('./PreviewButtonGroup.vue')),
  },
  Collapse: {
    label: 'Collapse',
    icon: 'chevron-down',
    component: defineAsyncComponent(() => import('./PreviewCollapse.vue')),
  },
  Dropdown: {
    label: 'Dropdown',
    icon: 'chevrons-up-down',
    component: defineAsyncComponent(() => import('./PreviewDropdown.vue')),
  },
  ListGroup: {
    label: 'List Group',
    icon: 'list',
    component: defineAsyncComponent(() => import('./PreviewListGroup.vue')),
  },
  Banners: {
    label: 'Banners',
    icon: 'rectangle-horizontal',
    component: defineAsyncComponent(() => import('./PreviewBanners.vue')),
  },
  Testimonials: {
    label: 'Testimonials',
    icon: 'quote',
    component: defineAsyncComponent(() => import('./PreviewTestimonials.vue')),
  },
  PostCard: {
    label: 'Post Card',
    icon: 'newspaper',
    component: defineAsyncComponent(() => import('./PreviewPostCard.vue')),
  },
  EventCard: {
    label: 'Event Card',
    icon: 'calendar-days',
    component: defineAsyncComponent(() => import('./PreviewEventCard.vue')),
  },
  VideoPreview: {
    label: 'Video preview',
    icon: 'circle-play',
    component: defineAsyncComponent(() => import('./PreviewVideoPreview.vue')),
  },
  Marquee: {
    label: 'Marquee',
    icon: 'gallery-horizontal',
    component: defineAsyncComponent(() => import('./PreviewMarquee.vue')),
  },
};

export const resolveElementPreview = (key: string) => ELEMENTS_REGISTRY[key]?.component || null;
