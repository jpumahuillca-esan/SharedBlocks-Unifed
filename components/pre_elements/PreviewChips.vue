<script setup lang="ts">
/**
 * PreviewChips — muestra MoleculeChip en sus dos variantes (Elementos >
 * Chips/Tags de webunificada): filtro y removible. Solo vista previa,
 * no se usa en bloques reales.
 */
import { ref } from 'vue';
import MoleculeChip from '../molecules/MoleculeChip.vue';

const activeFilter = ref('todos');

const filters = [
  { value: 'todos', label: 'Todos' },
  { value: 'mba', label: 'MBA' },
  { value: 'maestrias', label: 'Maestrías' },
  { value: 'diplomados', label: 'Diplomados' },
];

const appliedFilters = ref(['Finanzas', 'Presencial', 'Turno noche']);

const removeFilter = (label: string) => {
  appliedFilters.value = appliedFilters.value.filter((f) => f !== label);
};
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Filtro</span>
      <div class="preview-row-wrap">
        <MoleculeChip
          v-for="filter in filters"
          :key="filter.value"
          :active="activeFilter === filter.value"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </MoleculeChip>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Removible</span>
      <div class="preview-row-wrap">
        <MoleculeChip
          v-for="label in appliedFilters"
          :key="label"
          removable
          :remove-label="`Quitar filtro ${label}`"
          @remove="removeFilter(label)"
        >
          {{ label }}
        </MoleculeChip>
        <span v-if="!appliedFilters.length" class="preview-empty">Sin filtros aplicados</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
}
.preview-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.preview-group__label {
  font-size: 10px;
  font-family: monospace;
  color: #999;
  text-transform: uppercase;
}
.preview-row-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.preview-empty {
  font-size: 12px;
  color: #999;
}
</style>
