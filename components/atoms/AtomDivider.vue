<script setup lang="ts">
/**
 * AtomDivider — átomo de separador (ARCIS Design System, Elementos >
 * Dividers).
 *
 * Envuelve las clases .divider/.divider--label/.divider--vertical
 * portadas en assets/styles/elements/_dividers.scss. No redeclara
 * estilos propios.
 *
 * Tres variantes con etiquetas HTML distintas, igual que en webunificada:
 * - "horizontal": <hr class="divider">.
 * - "label": <div class="divider--label"><slot/></div> (línea + texto + línea,
 *   ej. "o continúa con").
 * - "vertical": <span class="divider--vertical"></span> (para uso inline,
 *   ej. entre "Pregrado" | "Posgrado").
 */
import { computed } from 'vue';

type DividerVariant = 'horizontal' | 'label' | 'vertical';

const props = withDefaults(defineProps<{
  variant?: DividerVariant;
}>(), {
  variant: 'horizontal',
});

const tag = computed(() => {
  if (props.variant === 'horizontal') return 'hr';
  if (props.variant === 'vertical') return 'span';
  return 'div';
});

const classes = computed(() => {
  if (props.variant === 'label') return ['divider--label'];
  if (props.variant === 'vertical') return ['divider--vertical'];
  return ['divider'];
});
</script>

<template>
  <hr v-if="variant === 'horizontal'" :class="classes" />
  <span v-else-if="variant === 'vertical'" :class="classes"></span>
  <div v-else :class="classes">
    <slot />
  </div>
</template>
