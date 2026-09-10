<script setup lang="ts">
/**
 * PreviewDropdown — muestra MoleculeDropdown con el ejemplo exacto de
 * webunificada (Elementos > Dropdown): "Programas" con MBA/Maestrías/
 * Diplomados, separador, y "Ver todos los programas". Solo vista
 * previa, no se usa en bloques reales.
 */
import MoleculeDropdown, { type DropdownItem } from '../molecules/MoleculeDropdown.vue';

const items: DropdownItem[] = [
  { label: 'MBA', icon: 'graduation-cap' },
  { label: 'Maestrías', icon: 'briefcase' },
  { label: 'Diplomados', icon: 'award' },
  { divider: true },
  { label: 'Ver todos los programas', icon: 'search' },
];
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Click para abrir</span>
      <div class="preview-stage">
        <MoleculeDropdown label="Programas" :items="items" />
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
.preview-stage {
  min-height: 220px;
}
.dropdown {
  align-self: flex-start;
}
</style>
