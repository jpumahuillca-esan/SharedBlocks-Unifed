<script setup lang="ts">
/**
 * MoleculeButtonGroup — control segmentado de selección única (ARCIS
 * Design System, Elementos > Button Group).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque, en
 * su variante solo-ícono, compone el átomo AtomIcon — mismo criterio
 * que MoleculeAlert/MoleculePagination.
 *
 * Envuelve ".btn-group"/".btn-group__item" portadas en
 * assets/styles/elements/_button-group.scss. No redeclara estilos
 * propios.
 *
 * La selección única de webunificada (initButtonGroups() en main.js,
 * que manipula clases a mano) se resuelve acá con v-model normal de
 * Vue: cada ítem es un `value`, y el ítem cuyo `value` coincide con
 * `modelValue` recibe ".is-active".
 *
 * Un mismo `items` sirve para ambas variantes de la guía viva — con
 * `label` (texto) o con `icon` + `ariaLabel` (solo ícono, sin texto
 * visible) — no son componentes separados, solo cambia qué props trae
 * cada ítem.
 */
import AtomIcon from '../atoms/AtomIcon.vue';

export interface ButtonGroupItem {
  value: string;
  label?: string;
  icon?: string;
  /** Requerido si el ítem no tiene `label` visible (variante solo-ícono). */
  ariaLabel?: string;
}

defineProps<{
  items: ButtonGroupItem[];
  modelValue: string;
  /** aria-label del grupo completo, ej. "Nivel académico". */
  ariaLabel: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <div class="btn-group btn-group--arcis" role="group" :aria-label="ariaLabel">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      class="btn-group__item"
      :class="{ 'is-active': item.value === modelValue }"
      :aria-label="item.ariaLabel"
      @click="emit('update:modelValue', item.value)"
    >
      <AtomIcon v-if="item.icon" :name="item.icon" :size="16" />
      <template v-if="item.label">{{ item.label }}</template>
    </button>
  </div>
</template>
