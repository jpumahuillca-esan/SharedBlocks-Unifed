<script setup lang="ts">
/**
 * AtomFormLabel — átomo de etiqueta de campo (ARCIS Design System,
 * Elementos > Formularios).
 *
 * Envuelve ".form-label" portada en assets/styles/elements/_forms.scss.
 * ".form-label" es un nombre de clase de Bootstrap 5: por eso este átomo
 * agrega también el marcador "form-label--arcis" (ver comentario de
 * colisión al inicio de _forms.scss) — nunca usar ".form-label" a mano
 * en markup real, siempre a través de este átomo.
 */
import { computed } from 'vue';

const props = defineProps<{
  for?: string;
}>();

const classes = computed(() => ['form-label', 'form-label--arcis']);
</script>

<template>
  <label :class="classes" :for="props.for">
    <slot />
  </label>
</template>
