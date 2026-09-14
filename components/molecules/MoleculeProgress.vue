<script setup lang="ts">
/**
 * MoleculeProgress — Progress bar con etiqueta (ARCIS Design System,
 * Elementos > Progress bars).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque compone
 * el átomo AtomProgress — mismo criterio que MoleculeCard/MoleculeAlert.
 *
 * Envuelve ".progress-group"/".progress-group__meta" portadas en
 * assets/styles/elements/_progress.scss. No redeclara estilos propios.
 *
 * El texto de la derecha del meta no siempre es un porcentaje: en
 * webunificada, el ejemplo de "Plazo de pago de matrícula" muestra
 * "Quedan 3 días" en vez de "85%" — por eso `meta` es libre y solo cae
 * al porcentaje por defecto si no se pasa.
 */
import AtomProgress from '../atoms/AtomProgress.vue';

const props = withDefaults(defineProps<{
  label: string;
  value: number;
  meta?: string;
  size?: 'default' | 'sm';
  variant?: 'default' | 'success' | 'warning';
}>(), {
  size: 'default',
  variant: 'default',
});
</script>

<template>
  <div class="progress-group">
    <div class="progress-group__meta">
      <span>{{ label }}</span>
      <span>{{ meta ?? `${value}%` }}</span>
    </div>
    <AtomProgress :value="value" :size="size" :variant="variant" />
  </div>
</template>
