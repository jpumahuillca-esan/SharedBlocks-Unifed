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

type BadgeVariant = 'brand' | 'brand-solid' | 'neutral' | 'info' | 'success' | 'warning' | 'error';

const props = withDefaults(defineProps<{
  variant?: BadgeVariant;
  /** Etiqueta a renderizar. Por defecto <span>. */
  as?: string;
}>(), {
  variant: 'brand',
  as: 'span',
});

const classes = computed(() => ['badge', `badge--${props.variant}`]);
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
