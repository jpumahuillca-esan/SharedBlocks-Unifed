<script setup lang="ts">
/**
 * AtomBadge — átomo de etiqueta de estado/categoría (ARCIS Design System).
 *
 * Envuelve las clases .badge/.badge--* portadas en
 * assets/styles/elements/_badges.scss. No redeclara estilos propios:
 * cambiar el look de los badges se hace una sola vez ahí y se propaga
 * a todo lo que use este átomo.
 */
import { computed } from 'vue';

/** "outline" es la del Figma sin relleno: contorno gris y texto negro. */
export type BadgeVariant = 'brand' | 'brand-solid' | 'neutral' | 'outline' | 'info' | 'success' | 'warning' | 'error';

const props = withDefaults(defineProps<{
  variant?: BadgeVariant;
  /**
   * Forma "fixed" del Figma: esquinas rectas en vez de la píldora. Mismos
   * colores; solo cambia el contorno de la caja.
   */
  fixed?: boolean;
  /** Etiqueta a renderizar. Por defecto <span>. */
  as?: string;
}>(), {
  variant: 'brand',
  as: 'span',
});

const classes = computed(() => [
  'badge',
  `badge--${props.variant}`,
  props.fixed ? 'badge--fixed' : null,
]);
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
