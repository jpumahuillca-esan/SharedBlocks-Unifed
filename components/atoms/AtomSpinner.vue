<script setup lang="ts">
/**
 * AtomSpinner — átomo de loader circular (ARCIS Design System,
 * Elementos > Loaders/Spinners).
 *
 * Envuelve las clases .spinner/.spinner--sm/.spinner--lg/.spinner--inverse
 * portadas en assets/styles/elements/_loaders.scss. No redeclara estilos
 * propios.
 *
 * "inverse" es un modificador propio (no de webunificada, que acá usa un
 * estilo inline puntual) para el caso reutilizable de spinner blanco
 * sobre fondos oscuros/de color, ej. dentro de un botón --primary en
 * estado de carga (ver nota de desviación en _loaders.scss).
 */
import { computed } from 'vue';

type SpinnerSize = 'sm' | 'md' | 'lg';

const props = withDefaults(defineProps<{
  size?: SpinnerSize;
  inverse?: boolean;
  /** Texto accesible para lectores de pantalla (role="status" + aria-label). */
  label?: string;
}>(), {
  size: 'md',
  label: 'Cargando',
});

const classes = computed(() => [
  'spinner',
  props.size !== 'md' ? `spinner--${props.size}` : null,
  props.inverse ? 'spinner--inverse' : null,
]);
</script>

<template>
  <span :class="classes" role="status" :aria-label="label"></span>
</template>
