<script setup lang="ts">
/**
 * MoleculeChip — Chip/Tag (ARCIS Design System, Elementos > Chips/Tags).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque, en su
 * variante removible, compone otro átomo (AtomIcon, para el "x" fijo del
 * botón de quitar) — mismo criterio que MoleculeAlert.
 *
 * Envuelve las clases .chip/.is-active/.chip__remove portadas en
 * assets/styles/elements/_chips.scss. No redeclara estilos propios.
 *
 * Dos variantes, cada una con su propia etiqueta HTML real (igual que
 * webunificada, no es solo un cambio de clase):
 * - "filter" (default): <button class="chip">, clickeable, con estado
 *   is-active (selección única en un grupo de filtros).
 * - "removable": <span class="chip"> con el texto + un <button
 *   class="chip__remove"> aparte con el ícono "x", para filtros aplicados.
 */
import { computed } from 'vue';
import AtomIcon from '../atoms/AtomIcon.vue';

const props = withDefaults(defineProps<{
  removable?: boolean;
  /** Solo variante "filter": si este chip está seleccionado. */
  active?: boolean;
  /** Solo variante "removable": aria-label del botón de quitar, ej. "Quitar filtro Finanzas". */
  removeLabel?: string;
}>(), {
  removable: false,
  active: false,
  removeLabel: 'Quitar filtro',
});

const emit = defineEmits<{
  click: [];
  remove: [];
}>();

const classes = computed(() => ['chip', props.active ? 'is-active' : null]);
</script>

<template>
  <button v-if="!removable" type="button" :class="classes" @click="emit('click')">
    <slot />
  </button>
  <span v-else :class="classes">
    <slot />
    <button type="button" class="chip__remove" :aria-label="removeLabel" @click="emit('remove')">
      <AtomIcon name="x" :size="14" />
    </button>
  </span>
</template>
