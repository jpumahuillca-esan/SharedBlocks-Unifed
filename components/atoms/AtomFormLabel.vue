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
 *
 * Dos formas, las dos del Figma:
 * - normal: encima del campo (la del "Form group" de la lámina).
 * - floating: dentro del campo, y sube a sentarse sobre el borde
 *   superior cuando el campo tiene foco o valor. La posición y el salto
 *   los hace el CSS; acá solo se marca la forma.
 */
import { computed } from 'vue';

const props = defineProps<{
  for?: string;
  /** Agrega el asterisco rojo de campo obligatorio. */
  required?: boolean;
  /** Etiqueta flotante: se posiciona dentro de .form-field--floating. */
  floating?: boolean;
}>();

const classes = computed(() => [
  'form-label',
  'form-label--arcis',
  props.required ? 'form-label--required' : null,
  props.floating ? 'form-label--floating' : null,
]);
</script>

<template>
  <label :class="classes" :for="props.for">
    <slot />
  </label>
</template>
