<script setup lang="ts">
/**
 * PreviewListGroup — muestra MoleculeListGroup con el ejemplo exacto de
 * webunificada (Elementos > List Group): Datos personales / Documentos
 * (activo) / Pagos. Solo vista previa, no se usa en bloques reales.
 */
import MoleculeListGroup, { type ListGroupItem } from '../molecules/MoleculeListGroup.vue';

const items: ListGroupItem[] = [
  { label: 'Datos personales', icon: 'user' },
  { label: 'Documentos', icon: 'file-text', active: true },
  { label: 'Pagos', icon: 'credit-card' },
];
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Menú de trámite</span>
      <div class="preview-column-wrap">
        <MoleculeListGroup :items="items" />
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
  gap: 12px;
}
.preview-group__label {
  font-size: 10px;
  font-family: monospace;
  color: #999;
  text-transform: uppercase;
}
.preview-column-wrap {
  max-width: 420px;
}
</style>
