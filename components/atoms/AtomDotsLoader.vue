<script setup lang="ts">
/**
 * AtomDotsLoader — átomo de loader de puntos (ARCIS Design System,
 * Elementos > Loaders/Spinners).
 *
 * Envuelve ".dots-loader" portada en assets/styles/elements/_loaders.scss.
 * No redeclara estilos propios. Los 3 <span> internos son fijos (el CSS
 * anima cada uno con un retraso distinto vía :nth-child), no configurables.
 */
withDefaults(defineProps<{
  /** Texto accesible para lectores de pantalla (role="status" + aria-label). */
  label?: string;
}>(), {
  label: 'Cargando',
});
</script>

<template>
  <span class="dots-loader" role="status" :aria-label="label">
    <span></span><span></span><span></span>
  </span>
</template>
