<script setup lang="ts">
/**
 * AtomEyebrow — átomo de etiqueta corta sobre títulos de sección
 * (ARCIS Design System).
 *
 * Envuelve las clases .eyebrow/.eyebrow--neutral/.eyebrow--inverse
 * portadas en assets/styles/elements/_badges.scss (misma sección de
 * webunificada que Badge: "Badges & Eyebrow"). No redeclara estilos
 * propios.
 */
import { computed } from 'vue';

type EyebrowVariant = 'brand' | 'neutral' | 'inverse';

const props = withDefaults(defineProps<{
  /** "brand" (rojo institucional, por defecto), "neutral" (gris) o
   * "inverse" (blanco, para fondos de color/oscuros — ej. banner--brand). */
  variant?: EyebrowVariant;
  as?: string;
}>(), {
  variant: 'brand',
  as: 'span',
});

const classes = computed(() => [
  'eyebrow',
  props.variant !== 'brand' ? `eyebrow--${props.variant}` : null,
]);
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
