<script setup lang="ts">
/**
 * AtomProgress — átomo de barra de progreso (ARCIS Design System,
 * Elementos > Progress bars).
 *
 * Envuelve ".progress"/".progress__bar" portadas en
 * assets/styles/elements/_progress.scss. No redeclara estilos propios.
 *
 * ".progress" es un nombre de clase de Bootstrap 5: por eso este átomo
 * agrega también el marcador "progress--arcis" (ver comentario de
 * colisión al inicio de _progress.scss) — nunca usar ".progress" a mano
 * en markup real, siempre a través de este átomo.
 */
import { computed } from 'vue';

type ProgressSize = 'default' | 'sm';
type ProgressVariant = 'default' | 'success' | 'warning';

const props = withDefaults(defineProps<{
  /** Porcentaje completado, 0-100. */
  value: number;
  size?: ProgressSize;
  variant?: ProgressVariant;
}>(), {
  size: 'default',
  variant: 'default',
});

const classes = computed(() => [
  'progress',
  'progress--arcis',
  props.size === 'sm' ? 'progress--sm' : null,
  props.variant !== 'default' ? `progress--${props.variant}` : null,
]);
</script>

<template>
  <div :class="classes">
    <div class="progress__bar" :style="{ width: `${value}%` }"></div>
  </div>
</template>
