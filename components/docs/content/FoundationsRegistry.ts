import { defineAsyncComponent } from 'vue';

/**
 * FoundationsRegistry — catálogo de secciones de "Foundations" (arcis-2)
 * para la página de Documentación. Cada entrada apunta a un visor que arma su
 * contenido desde los archivos de tokens a través de content/dsTokens.ts
 * (ds/ds-tokens.css, ds/_extensions.scss y breakpoints.scss): nunca valores
 * copiados a mano en un tercer lugar que pueda desincronizarse.
 */
export const FOUNDATIONS_REGISTRY: Record<string, {
  label: string;
  description: string;
  component: ReturnType<typeof defineAsyncComponent>;
}> = {
  Colors: {
    label: 'Colors',
    description: 'Paleta de arcis-2 tal como la exporta Figma: primero los semánticos (fondo, superficie, texto, borde, acción, marca y feedback), que son los que usan los componentes, y después los primitivos.',
    component: defineAsyncComponent(() => import('../foundations/FoundationsColors.vue')),
  },
  Typography: {
    label: 'Typography',
    description: 'Familias, escala semántica de tamaños (--ds-text-*) con su valor de escritorio y de móvil, pesos, interlineado y espaciado entre letras.',
    component: defineAsyncComponent(() => import('../foundations/FoundationsTypography.vue')),
  },
  Spacing: {
    label: 'Spacing',
    description: 'Espaciado semántico responsive (--ds-spacing-*), para padding, margin y gap, y la escala primitiva fija (--ds-space-*), para medidas y posiciones.',
    component: defineAsyncComponent(() => import('../foundations/FoundationsSpacing.vue')),
  },
  Radius: {
    label: 'Radius',
    description: 'Radios de borde (--ds-radius-*), de xs a full (pill).',
    component: defineAsyncComponent(() => import('../foundations/FoundationsRadius.vue')),
  },
  Shadows: {
    label: 'Shadows',
    description: 'Sombras (--ds-shadow-*), de sutil (sm) a pronunciada (lg). Extensión local: arcis-2 aún no las define.',
    component: defineAsyncComponent(() => import('../foundations/FoundationsShadows.vue')),
  },
  Borders: {
    label: 'Borders',
    description: 'Anchos de borde (--ds-border-width-*) y colores semánticos de borde (--ds-color-border-*).',
    component: defineAsyncComponent(() => import('../foundations/FoundationsBorders.vue')),
  },
  Breakpoints: {
    label: 'Breakpoints',
    description: 'Puntos de quiebre de arcis-2 (xs a 3xl) más el propio de la librería para los CTA, con lo que cambia en cada uno.',
    component: defineAsyncComponent(() => import('../foundations/FoundationsBreakpoints.vue')),
  },
  Icons: {
    label: 'Icons',
    description: 'Íconos de Lucide disponibles vía AtomIcon — click en cualquiera para copiar su nombre.',
    component: defineAsyncComponent(() => import('../foundations/FoundationsIcons.vue')),
  },
};
