import { defineAsyncComponent } from 'vue';

/**
 * FoundationsRegistry — catálogo de secciones de "Foundations" (ARCIS
 * Design System) para la página de Documentación. Cada entrada apunta
 * a un componente visor que lee directo de assets/styles/tokens.scss
 * (o, para Breakpoints, de assets/styles/breakpoints.scss) — nunca
 * valores copiados a mano en un tercer lugar que pueda desincronizarse.
 */
export const FOUNDATIONS_REGISTRY: Record<string, {
  label: string;
  description: string;
  component: ReturnType<typeof defineAsyncComponent>;
}> = {
  Colors: {
    label: 'Colors',
    description: 'Paleta completa de tokens de color: global, texto, neutrals, corporativos, universidad, facultades, maestrías, DPA, graduate, ecosistemas, gobierno y semánticos.',
    component: defineAsyncComponent(() => import('../foundations/FoundationsColors.vue')),
  },
  Typography: {
    label: 'Typography',
    description: 'Familias tipográficas, escala de tamaños (display a xs) y pesos disponibles.',
    component: defineAsyncComponent(() => import('../foundations/FoundationsTypography.vue')),
  },
  Spacing: {
    label: 'Spacing',
    description: 'Escala de espaciado de 10 pasos, de 4px a 120px.',
    component: defineAsyncComponent(() => import('../foundations/FoundationsSpacing.vue')),
  },
  Radius: {
    label: 'Radius',
    description: 'Escala de border-radius, de 4px a "full" (pill).',
    component: defineAsyncComponent(() => import('../foundations/FoundationsRadius.vue')),
  },
  Shadows: {
    label: 'Shadows',
    description: 'Escala de sombras, de sutil (sm) a pronunciada (lg).',
    component: defineAsyncComponent(() => import('../foundations/FoundationsShadows.vue')),
  },
  Borders: {
    label: 'Borders',
    description: 'Anchos y colores de borde estándar.',
    component: defineAsyncComponent(() => import('../foundations/FoundationsBorders.vue')),
  },
  Breakpoints: {
    label: 'Breakpoints',
    description: 'Puntos de quiebre responsivos — los 4 de la escala Bootstrap grid más los 2 propios del proyecto.',
    component: defineAsyncComponent(() => import('../foundations/FoundationsBreakpoints.vue')),
  },
  Icons: {
    label: 'Icons',
    description: 'Íconos de Lucide disponibles vía AtomIcon — click en cualquiera para copiar su nombre.',
    component: defineAsyncComponent(() => import('../foundations/FoundationsIcons.vue')),
  },
};
